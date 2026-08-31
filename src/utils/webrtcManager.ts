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
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    { urls: 'stun:stun.services.mozilla.com' },
    {
      urls: [
        'turn:openrelay.metered.ca:80',
        'turn:openrelay.metered.ca:443',
        'turn:openrelay.metered.ca:443?transport=tcp',
      ],
      username: 'openrelay',
      credential: 'openrelay',
    },
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
                width: { ideal: 640, max: 1280 },
                height: { ideal: 480, max: 720 },
                frameRate: { ideal: 24, max: 30 },
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
      console.warn('WebRTC getUserMedia initial attempt failed:', err);
      // Fallback 1: Try flexible video constraints
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
          // Fallback 2: Any video and audio
          try {
            const anyVideoStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            this.localStream = anyVideoStream;
            if (this.onLocalStreamCallback) {
              this.onLocalStreamCallback(anyVideoStream);
            }
            this.setupAudioAnalysis(anyVideoStream);
            return anyVideoStream;
          } catch {
            // Fallback 3: Audio only if video is completely blocked/missing
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
    }
    return null;
  }

  private setupAudioAnalysis(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioTracks = stream.getAudioTracks();
      if (!audioTracks || audioTracks.length === 0) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkVolume = (timestamp: number) => {
        if (this.analyser && this.audioMeterCallback) {
          if (timestamp - this.lastMeterTime > 80) {
            this.lastMeterTime = timestamp;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            this.audioMeterCallback(avg / 128);
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
    if (typeof window === 'undefined' || !window.RTCPeerConnection) return stream;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnection = pc;

      this.remoteStream = new MediaStream();
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }

      // Add local media tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      // Ensure video receiver transceiver is created if doing video call
      if (type === 'video') {
        const hasVideoTrack = stream?.getVideoTracks().length;
        if (!hasVideoTrack) {
          try {
            pc.addTransceiver('video', { direction: 'recvonly' });
          } catch {}
        }
      }

      // Handle remote incoming tracks (both video & audio)
      pc.ontrack = (event) => {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }

        if (event.streams && event.streams[0]) {
          event.streams[0].getTracks().forEach((track) => {
            if (!this.remoteStream!.getTracks().some((t) => t.id === track.id)) {
              this.remoteStream!.addTrack(track);
            }
          });
        } else if (event.track) {
          if (!this.remoteStream.getTracks().some((t) => t.id === event.track.id)) {
            this.remoteStream.addTrack(event.track);
          }
        }

        if (this.onRemoteStreamCallback && this.remoteStream) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      const callDocRef = doc(db, 'active_calls', callId);
      const callerCandidatesCol = collection(callDocRef, 'callerCandidates');
      const pendingRemoteCandidates: RTCIceCandidateInit[] = [];

      // Stream local ICE candidates to Firestore
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

      await updateDoc(callDocRef, { offer }).catch((err) => {
        console.warn('Error updating offer in Firestore:', err);
      });

      // Listen for Answer SDP from Callee
      this.unsubDoc = onSnapshot(callDocRef, async (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pc.currentRemoteDescription) {
          try {
            const answerDescription = new RTCSessionDescription(data.answer);
            await pc.setRemoteDescription(answerDescription);

            // Flush buffered ICE candidates
            while (pendingRemoteCandidates.length > 0) {
              const cand = pendingRemoteCandidates.shift();
              if (cand) {
                await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
              }
            }
          } catch (err) {
            console.warn('Error setting remote description on caller:', err);
          }
        }
      });

      // Listen for Callee ICE candidates
      const calleeCandidatesCol = collection(callDocRef, 'calleeCandidates');
      this.unsubCalleeCandidates = onSnapshot(calleeCandidatesCol, async (snapshot) => {
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added') {
            const data = change.doc.data() as RTCIceCandidateInit;
            if (pc.currentRemoteDescription && pc.currentRemoteDescription.type) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(data));
              } catch (err) {
                console.warn('Error adding callee candidate:', err);
              }
            } else {
              pendingRemoteCandidates.push(data);
            }
          }
        }
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
    if (typeof window === 'undefined' || !window.RTCPeerConnection) return stream;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnection = pc;

      this.remoteStream = new MediaStream();
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }

      // Add local media tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      // Ensure video receiver transceiver is created if doing video call
      if (type === 'video') {
        const hasVideoTrack = stream?.getVideoTracks().length;
        if (!hasVideoTrack) {
          try {
            pc.addTransceiver('video', { direction: 'recvonly' });
          } catch {}
        }
      }

      // Handle remote incoming tracks (both video & audio)
      pc.ontrack = (event) => {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }

        if (event.streams && event.streams[0]) {
          event.streams[0].getTracks().forEach((track) => {
            if (!this.remoteStream!.getTracks().some((t) => t.id === track.id)) {
              this.remoteStream!.addTrack(track);
            }
          });
        } else if (event.track) {
          if (!this.remoteStream.getTracks().some((t) => t.id === event.track.id)) {
            this.remoteStream.addTrack(event.track);
          }
        }

        if (this.onRemoteStreamCallback && this.remoteStream) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      const callDocRef = doc(db, 'active_calls', callId);
      const calleeCandidatesCol = collection(callDocRef, 'calleeCandidates');
      const pendingRemoteCandidates: RTCIceCandidateInit[] = [];

      // Stream local ICE candidates to Firestore
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(calleeCandidatesCol, event.candidate.toJSON()).catch((err) => {
            console.warn('Error saving callee candidate:', err);
          });
        }
      };

      let answerCreated = false;

      const handleRemoteOffer = async (offerDescription: any) => {
        if (answerCreated || pc.currentRemoteDescription || !offerDescription) return;
        try {
          answerCreated = true;
          await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

          // Flush any buffered candidates
          while (pendingRemoteCandidates.length > 0) {
            const cand = pendingRemoteCandidates.shift();
            if (cand) {
              await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
            }
          }

          // Create Answer SDP
          const answerDescription = await pc.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: type === 'video',
          });
          await pc.setLocalDescription(answerDescription);

          const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
          };

          await updateDoc(callDocRef, { answer, status: 'connected' });
        } catch (err) {
          console.warn('Error handling remote offer on callee:', err);
          answerCreated = false;
        }
      };

      // Check if offer is already available
      const callDocSnap = await getDoc(callDocRef);
      if (callDocSnap.exists() && callDocSnap.data()?.offer) {
        await handleRemoteOffer(callDocSnap.data()?.offer);
      }

      // Realtime listener for offer in case of network latency
      this.unsubDoc = onSnapshot(callDocRef, async (snapshot) => {
        const data = snapshot.data();
        if (data?.offer && !pc.currentRemoteDescription) {
          await handleRemoteOffer(data.offer);
        }
      });

      // Listen for Caller ICE candidates
      const callerCandidatesCol = collection(callDocRef, 'callerCandidates');
      this.unsubCallerCandidates = onSnapshot(callerCandidatesCol, async (snapshot) => {
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added') {
            const data = change.doc.data() as RTCIceCandidateInit;
            if (pc.currentRemoteDescription && pc.currentRemoteDescription.type) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(data));
              } catch (err) {
                console.warn('Error adding caller candidate on callee:', err);
              }
            } else {
              pendingRemoteCandidates.push(data);
            }
          }
        }
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
