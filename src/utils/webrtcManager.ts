import { db } from '../firebase/config';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { CallType } from '../types';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string | null = null;
  private unsubDoc: (() => void) | null = null;
  private unsubCallerCandidates: (() => void) | null = null;
  private unsubCalleeCandidates: (() => void) | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onLocalStreamCallback: ((stream: MediaStream) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioMeterCallback: ((level: number) => void) | null = null;
  private audioMeterAnimationId: number | null = null;
  private lastMeterTime: number = 0;

  public async getLocalMedia(type: CallType = 'audio', cameraFacing: 'user' | 'environment' = 'user'): Promise<MediaStream | null> {
    try {
      if (this.localStream) {
        this.localStream.getTracks().forEach((t) => t.stop());
        this.localStream = null;
      }

      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video:
          type === 'video'
            ? {
                facingMode: cameraFacing,
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30, max: 30 },
              }
            : false,
      };

      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.localStream = stream;
        if (this.onLocalStreamCallback) {
          this.onLocalStreamCallback(stream);
        }
        this.setupAudioAnalysis(stream);
        return stream;
      }
    } catch (err) {
      console.warn('WebRTC getUserMedia failed or was denied:', err);
      // Fallback: try standard video or audio only if initial high-res failed
      if (type === 'video') {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing },
            audio: true,
          });
          this.localStream = fallbackStream;
          if (this.onLocalStreamCallback) {
            this.onLocalStreamCallback(fallbackStream);
          }
          this.setupAudioAnalysis(fallbackStream);
          return fallbackStream;
        } catch {
          try {
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.localStream = audioOnlyStream;
            if (this.onLocalStreamCallback) {
              this.onLocalStreamCallback(audioOnlyStream);
            }
            this.setupAudioAnalysis(audioOnlyStream);
            return audioOnlyStream;
          } catch {
            // ignore
          }
        }
      }
    }
    return null;
  }

  private setupAudioAnalysis(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkVolume = (timestamp: number) => {
        if (this.analyser && this.audioMeterCallback) {
          // Throttle to max 12 updates per second (~80ms) for high performance without jitter
          if (timestamp - this.lastMeterTime > 80) {
            this.lastMeterTime = timestamp;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            this.audioMeterCallback(avg / 128); // 0.0 to 2.0 scale
          }
        }
        this.audioMeterAnimationId = requestAnimationFrame(checkVolume);
      };

      this.audioMeterAnimationId = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.warn('Audio analyser setup error:', err);
    }
  }

  public setAudioMeterListener(cb: ((level: number) => void) | null) {
    this.audioMeterCallback = cb;
  }

  public setOnLocalStream(cb: ((stream: MediaStream) => void) | null) {
    this.onLocalStreamCallback = cb;
    if (cb && this.localStream) {
      cb(this.localStream);
    }
  }

  public setOnRemoteStream(cb: ((stream: MediaStream) => void) | null) {
    this.onRemoteStreamCallback = cb;
    if (cb && this.remoteStream) {
      cb(this.remoteStream);
    }
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  public async startCaller(
    callId: string,
    type: CallType,
    onRemoteStream: (stream: MediaStream) => void
  ): Promise<MediaStream | null> {
    this.cleanup();
    this.callId = callId;
    this.onRemoteStreamCallback = onRemoteStream;

    const stream = await this.getLocalMedia(type);
    if (!window.RTCPeerConnection) return stream;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnection = pc;

      this.remoteStream = new MediaStream();
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }

      // Add local tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      // Remote tracks received
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          if (this.remoteStream && !this.remoteStream.getTracks().some((t) => t.id === track.id)) {
            this.remoteStream.addTrack(track);
          }
        });
        if (this.onRemoteStreamCallback && this.remoteStream) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      // Push ICE candidates to Firestore
      const callDocRef = doc(db, 'active_calls', callId);
      const callerCandidatesCol = collection(callDocRef, 'callerCandidates');

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(callerCandidatesCol, event.candidate.toJSON()).catch((err) => {
            console.warn('Error saving caller candidate:', err);
          });
        }
      };

      // Create Offer SDP
      const offerDescription = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === 'video',
      });
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await updateDoc(callDocRef, { offer });

      // Listen for Answer SDP from Callee
      this.unsubDoc = onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription).catch((err) => {
            console.warn('Error setting remote description on caller:', err);
          });
        }
      });

      // Listen for Callee ICE candidates
      const calleeCandidatesCol = collection(callDocRef, 'calleeCandidates');
      this.unsubCalleeCandidates = onSnapshot(calleeCandidatesCol, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const candidate = new RTCIceCandidate(data);
            pc.addIceCandidate(candidate).catch((err) => {
              console.warn('Error adding callee candidate:', err);
            });
          }
        });
      });
    } catch (err) {
      console.warn('WebRTC startCaller error:', err);
    }

    return stream;
  }

  public async startCallee(
    callId: string,
    type: CallType,
    onRemoteStream: (stream: MediaStream) => void
  ): Promise<MediaStream | null> {
    this.cleanup();
    this.callId = callId;
    this.onRemoteStreamCallback = onRemoteStream;

    const stream = await this.getLocalMedia(type);
    if (!window.RTCPeerConnection) return stream;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnection = pc;

      this.remoteStream = new MediaStream();
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }

      // Add local tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      // Remote tracks received
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          if (this.remoteStream && !this.remoteStream.getTracks().some((t) => t.id === track.id)) {
            this.remoteStream.addTrack(track);
          }
        });
        if (this.onRemoteStreamCallback && this.remoteStream) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      const callDocRef = doc(db, 'active_calls', callId);
      const calleeCandidatesCol = collection(callDocRef, 'calleeCandidates');

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(calleeCandidatesCol, event.candidate.toJSON()).catch((err) => {
            console.warn('Error saving callee candidate:', err);
          });
        }
      };

      // Get Offer SDP from caller
      const callDocSnap = await getDoc(callDocRef);
      const callData = callDocSnap.data();
      const offerDescription = callData?.offer;

      if (offerDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        // Create Answer SDP
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };

        await updateDoc(callDocRef, { answer, status: 'connected' });
      }

      // Listen for Caller ICE candidates
      const callerCandidatesCol = collection(callDocRef, 'callerCandidates');
      this.unsubCallerCandidates = onSnapshot(callerCandidatesCol, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const candidate = new RTCIceCandidate(data);
            pc.addIceCandidate(candidate).catch((err) => {
              console.warn('Error adding caller candidate:', err);
            });
          }
        });
      });
    } catch (err) {
      console.warn('WebRTC startCallee error:', err);
    }

    return stream;
  }

  public setAudioMute(isMuted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }

  public setVideoOff(isVideoOff: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOff;
      });
    }
  }

  public async flipCamera(facing: 'user' | 'environment'): Promise<MediaStream | null> {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((t) => t.stop());
    }
    try {
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
      });
      const newVideoTrack = newVideoStream.getVideoTracks()[0];
      if (newVideoTrack && this.localStream) {
        const oldVideoTrack = this.localStream.getVideoTracks()[0];
        if (oldVideoTrack) {
          this.localStream.removeTrack(oldVideoTrack);
        }
        this.localStream.addTrack(newVideoTrack);

        if (this.peerConnection) {
          const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(newVideoTrack);
          }
        }
      }
      return this.localStream;
    } catch (err) {
      console.warn('Could not flip camera:', err);
      return this.localStream;
    }
  }

  public cleanup() {
    if (this.audioMeterAnimationId) {
      cancelAnimationFrame(this.audioMeterAnimationId);
      this.audioMeterAnimationId = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }

    if (this.unsubDoc) {
      this.unsubDoc();
      this.unsubDoc = null;
    }
    if (this.unsubCallerCandidates) {
      this.unsubCallerCandidates();
      this.unsubCallerCandidates = null;
    }
    if (this.unsubCalleeCandidates) {
      this.unsubCalleeCandidates();
      this.unsubCalleeCandidates = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => t.stop());
      this.remoteStream = null;
    }

    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {
        // ignore
      }
      this.peerConnection = null;
    }

    this.callId = null;
    this.onRemoteStreamCallback = null;
    this.audioMeterCallback = null;
  }
}

export const webrtcManager = new WebRTCManager();
