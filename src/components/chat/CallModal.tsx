import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Camera,
  Signal,
  User,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { webrtcManager } from '../../utils/webrtcManager';

export const CallModal: React.FC = () => {
  const { activeCall, endCall, toggleMute, toggleVideo, toggleSpeaker, toggleCameraFacing } = useChat();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState<boolean>(false);
  const [hasLocalVideo, setHasLocalVideo] = useState<boolean>(false);
  const [voiceActivity, setVoiceActivity] = useState<number>(0);

  // Sync streams with webrtcManager
  useEffect(() => {
    if (!activeCall) return;

    // Helper to evaluate stream tracks
    const syncLocal = (stream: MediaStream | null) => {
      setLocalStream(stream);
      if (stream) {
        const vTracks = stream.getVideoTracks();
        const hasV = vTracks.some((t) => t.readyState === 'live' && t.enabled);
        setHasLocalVideo(hasV);
      } else {
        setHasLocalVideo(false);
      }
    };

    const syncRemote = (stream: MediaStream | null) => {
      setRemoteStream(stream);
      if (stream) {
        const vTracks = stream.getVideoTracks();
        const hasV = vTracks.some((t) => t.readyState === 'live' && t.enabled);
        setHasRemoteVideo(hasV);
      } else {
        setHasRemoteVideo(false);
      }
    };

    // Attach local stream listener
    webrtcManager.setOnLocalStream((stream) => {
      syncLocal(stream);
    });

    // Attach remote stream listener
    webrtcManager.setOnRemoteStream((stream) => {
      syncRemote(stream);
    });

    // Check existing streams
    const curLocal = webrtcManager.getLocalStream();
    if (curLocal) syncLocal(curLocal);

    const curRemote = webrtcManager.getRemoteStream();
    if (curRemote) syncRemote(curRemote);

    // Audio meter listener
    webrtcManager.setAudioMeterListener((level) => {
      setVoiceActivity(level);
    });

    return () => {
      webrtcManager.setAudioMeterListener(null);
      webrtcManager.setOnLocalStream(null);
      webrtcManager.setOnRemoteStream(null);
    };
  }, [activeCall?.id]);

  // Track listeners on local stream
  useEffect(() => {
    if (!localStream) {
      setHasLocalVideo(false);
      return;
    }

    const checkLocal = () => {
      const vTracks = localStream.getVideoTracks();
      setHasLocalVideo(vTracks.some((t) => t.readyState === 'live' && t.enabled));
    };

    localStream.onaddtrack = checkLocal;
    localStream.onremovetrack = checkLocal;
    localStream.getVideoTracks().forEach((track) => {
      track.onmute = checkLocal;
      track.onunmute = checkLocal;
      track.onended = checkLocal;
    });

    checkLocal();

    if (localVideoRef.current && localVideoRef.current.srcObject !== localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }

    return () => {
      localStream.onaddtrack = null;
      localStream.onremovetrack = null;
    };
  }, [localStream, activeCall?.isVideoOff]);

  // Track listeners on remote stream & attach to video and audio
  useEffect(() => {
    if (!remoteStream) {
      setHasRemoteVideo(false);
      return;
    }

    const checkRemote = () => {
      const vTracks = remoteStream.getVideoTracks();
      const hasLiveVideo = vTracks.some((t) => t.readyState === 'live' && t.enabled);
      setHasRemoteVideo(hasLiveVideo);

      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      remoteVideoRef.current?.play().catch(() => {});

      if (remoteAudioRef.current && remoteAudioRef.current.srcObject !== remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
      remoteAudioRef.current?.play().catch(() => {});
    };

    remoteStream.onaddtrack = checkRemote;
    remoteStream.onremovetrack = checkRemote;
    remoteStream.getVideoTracks().forEach((track) => {
      track.onmute = checkRemote;
      track.onunmute = checkRemote;
      track.onended = checkRemote;
    });

    checkRemote();

    return () => {
      remoteStream.onaddtrack = null;
      remoteStream.onremovetrack = null;
    };
  }, [remoteStream]);

  if (!activeCall) return null;

  const isConnected = activeCall.status === 'connected';
  const minutes = Math.floor(activeCall.durationSeconds / 60);
  const seconds = activeCall.durationSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isSelfVideoActive = !activeCall.isVideoOff && hasLocalVideo;
  const isRemoteVideoActive = hasRemoteVideo && isConnected;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between text-white p-4 sm:p-6 select-none animate-fadeIn">
      {/* Hidden audio tag to ensure remote audio playback */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            {activeCall.type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{activeCall.isGroupCall ? 'প্রবাসী মুক্ত ফান্ড গ্রুপ কল' : activeCall.targetUser?.name || '১-টু-১ কল'}</span>
              <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Signal className="w-3 h-3 text-emerald-400" /> WebRTC HD
              </span>
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-emerald-300 font-bold">{timeFormatted}</span>
                  <span className="text-slate-400">• সংযুক্ত আছেন (Live Voice/Video)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-300 font-medium">কলিং হচ্ছে... (Connecting)</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action / Flip Camera button */}
        <div className="flex items-center space-x-2">
          {activeCall.isMuted && (
            <span className="px-2.5 py-1 rounded-xl bg-rose-500/30 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-1">
              <MicOff className="w-3 h-3" /> মাইক বন্ধ
            </span>
          )}
          {activeCall.type === 'video' && (
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
              title="Flip Camera"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Call View Canvas */}
      <div className="max-w-4xl w-full mx-auto flex-1 my-4 sm:my-6 flex items-center justify-center relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
        {activeCall.type === 'video' && !activeCall.isVideoOff ? (
          // Video Mode: Grid of Self Video + Remote Video Tile
          <div className="w-full h-full p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
            {/* 1. Self Video Tile */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 flex items-center justify-center shadow-lg min-h-[200px]">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${isSelfVideoActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
              />

              {!isSelfVideoActive && (
                <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl font-black text-white shadow-xl mb-3">
                    আপনি
                  </div>
                  <span className="text-sm font-bold text-white">আপনার ক্যামেরা</span>
                  <span className="text-2xs text-emerald-400 mt-0.5">ক্যামেরা চালু করা হচ্ছে...</span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>আপনি</span>
                {activeCall.isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
              </div>
            </div>

            {/* 2. Remote Participant Video Tile */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-800 flex items-center justify-center shadow-lg min-h-[200px]">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${isRemoteVideoActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
              />

              {!isRemoteVideoActive && (
                <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-emerald-500/40 flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-2 relative overflow-hidden">
                    {activeCall.targetUser?.avatar ? (
                      <img
                        src={activeCall.targetUser.avatar}
                        alt={activeCall.targetUser.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{activeCall.targetUser?.name?.charAt(0) || 'স'}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {activeCall.targetUser?.name || 'প্রবাসী সদস্য'}
                  </span>
                  <span className="text-2xs text-slate-400 mt-0.5">
                    {isConnected ? 'ভিডিও ফিড সংযুক্ত হচ্ছে...' : 'রিং হচ্ছে...'}
                  </span>

                  {/* Audio wave indicator */}
                  <div className="flex items-center gap-1 mt-3">
                    <span
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(6, voiceActivity * 24)}px` }}
                    />
                    <span
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(12, voiceActivity * 32)}px` }}
                    />
                    <span
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(6, voiceActivity * 20)}px` }}
                    />
                  </div>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-slate-200 flex items-center gap-1.5 z-20">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span>{activeCall.targetUser?.name || 'সদস্য'}</span>
              </div>
            </div>
          </div>
        ) : (
          // Audio Call Mode: Center avatar with dynamic live soundwave ripple rings
          <div className="flex flex-col items-center justify-center p-8 text-center relative z-10">
            {/* Animated Sound Wave Rings responsive to mic voice activity */}
            <div className="relative mb-6">
              {isConnected && (
                <>
                  <div
                    className="absolute -inset-4 rounded-full bg-emerald-500/20 pointer-events-none transition-transform duration-100"
                    style={{
                      transform: `scale(${1 + voiceActivity * 0.5})`,
                      opacity: 0.3 + voiceActivity * 0.7,
                    }}
                  />
                  <div
                    className="absolute -inset-8 rounded-full bg-emerald-500/10 pointer-events-none transition-transform duration-100"
                    style={{
                      transform: `scale(${1 + voiceActivity * 0.8})`,
                      opacity: 0.15 + voiceActivity * 0.5,
                    }}
                  />
                </>
              )}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border-4 border-emerald-400/40 flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-2xl relative overflow-hidden">
                {activeCall.targetUser?.avatar ? (
                  <img
                    src={activeCall.targetUser.avatar}
                    alt={activeCall.targetUser.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : activeCall.isGroupCall ? (
                  <span>প্রবাসী</span>
                ) : (
                  <span>{activeCall.targetUser?.name?.charAt(0) || 'প্র'}</span>
                )}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeCall.isGroupCall ? 'প্রবাসী মুক্ত ফান্ড কমিউনিটি অডিও কল' : activeCall.targetUser?.name || 'প্রবাসী সদস্য'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-400 font-semibold mt-1">
              {isConnected ? `ভয়েস সংযোগ সক্রিয় (${timeFormatted})` : 'রিং হচ্ছে... (Ringing)'}
            </p>

            {/* Live voice activity equalizer bars */}
            {isConnected && (
              <div className="flex items-center justify-center gap-1.5 mt-4 h-8">
                {[0.8, 1.4, 2.0, 1.6, 1.0, 1.8, 2.2, 1.2, 0.9].map((multiplier, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(6, Math.min(32, voiceActivity * 30 * multiplier + 6))}px`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Participants avatars strip */}
            <div className="flex items-center justify-center -space-x-2 mt-6">
              {activeCall.participants.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden"
                  title={p.name}
                >
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{p.name.charAt(0)}</span>
                  )}
                </div>
              ))}
              <div className="px-3 py-1 rounded-full bg-slate-800 text-2xs font-bold text-slate-300 border border-slate-700 ml-3">
                {activeCall.participants.length} জন সংযুক্ত
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="max-w-xl w-full mx-auto bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-around z-10">
        {/* Mic Toggle */}
        <button
          onClick={toggleMute}
          className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
            activeCall.isMuted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={activeCall.isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {activeCall.isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
            activeCall.isVideoOff
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              : activeCall.type === 'video'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={activeCall.isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {activeCall.isVideoOff ? (
            <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Video className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        {/* Speaker Toggle */}
        <button
          onClick={toggleSpeaker}
          className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
            activeCall.isSpeakerOn
              ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
          title={activeCall.isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
        >
          {activeCall.isSpeakerOn ? (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        {/* Red End Call Button */}
        <button
          onClick={endCall}
          className="p-3.5 sm:p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 transform hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>
    </div>
  );
};
