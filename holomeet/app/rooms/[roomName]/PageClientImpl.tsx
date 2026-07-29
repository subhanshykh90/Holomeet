// 'use client';
// import React from 'react';
// import { useSession } from 'next-auth/react';
// import { HostPanel } from '@/lib/HostPanel';
// import { decodePassphrase } from '@/lib/client-utils';
// import { DebugMode } from '@/lib/Debug';
// import { KeyboardShortcuts } from '@/lib/KeyboardShortcuts';
// import { RecordingIndicator } from '@/lib/RecordingIndicator';
// import { SettingsMenu } from '@/lib/SettingsMenu';
// import { ConnectionDetails } from '@/lib/types';
// import {
//   formatChatMessageLinks,
//   LocalUserChoices,
//   PreJoin,
//   RoomContext,
//   VideoConference,
// } from '@livekit/components-react';
// import {
//   ExternalE2EEKeyProvider,
//   RoomOptions,
//   VideoCodec,
//   VideoPresets,
//   Room,
//   DeviceUnsupportedError,
//   RoomConnectOptions,
//   RoomEvent,
//   TrackPublishDefaults,
//   VideoCaptureOptions,
//   Track,
// } from 'livekit-client';
// import { useRouter } from 'next/navigation';
// import { useSetupE2EE } from '@/lib/useSetupE2EE';
// import { useLowCPUOptimizer } from '@/lib/usePerfomanceOptimiser';

// const CONN_DETAILS_ENDPOINT =
//   process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';
// const SHOW_SETTINGS_MENU = process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU == 'true';

// export function PageClientImpl(props: {
//   roomName: string;
//   region?: string;
//   hq: boolean;
//   codec: VideoCodec;
// }) {
//   const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(undefined);
//   const preJoinDefaults = React.useMemo(() => {
//     return { username: '', videoEnabled: true, audioEnabled: true };
//   }, []);
//   const [connectionDetails, setConnectionDetails] = React.useState<ConnectionDetails | undefined>(undefined);

//   const handlePreJoinSubmit = React.useCallback(async (values: LocalUserChoices) => {
//     setPreJoinChoices(values);

//     const meetingRes = await fetch(`/api/meeting/get?roomName=${props.roomName}`);
//     const meetingData = await meetingRes.json();
//     const displayName = meetingData.isHost
//       ? `${values.username} (Host)`
//       : values.username;

//     // ATTENDANCE — record join time
//     try {
//       await fetch('/api/attendance/join', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ roomName: props.roomName }),
//       });
//     } catch (err) {
//       console.error('Attendance join error:', err);
//     }

//     const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
//     url.searchParams.append('roomName', props.roomName);
//     url.searchParams.append('participantName', displayName);
//     if (props.region) {
//       url.searchParams.append('region', props.region);
//     }
//     const connectionDetailsResp = await fetch(url.toString());
//     const connectionDetailsData = await connectionDetailsResp.json();
//     setConnectionDetails(connectionDetailsData);
//   }, [props.roomName]);

//   const handlePreJoinError = React.useCallback((e: any) => console.error(e), []);

//   return (
//     <main data-lk-theme="default" style={{ height: '100%' }}>
//       {connectionDetails === undefined || preJoinChoices === undefined ? (
//         <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
//           <PreJoin
//             defaults={preJoinDefaults}
//             onSubmit={handlePreJoinSubmit}
//             onError={handlePreJoinError}
//           />
//         </div>
//       ) : (
//         <VideoConferenceComponent
//           connectionDetails={connectionDetails}
//           userChoices={preJoinChoices}
//           options={{ codec: props.codec, hq: props.hq }}
//         />
//       )}
//     </main>
//   );
// }

// function VideoConferenceComponent(props: {
//   userChoices: LocalUserChoices;
//   connectionDetails: ConnectionDetails;
//   options: { hq: boolean; codec: VideoCodec };
// }) {
//   const { data: session } = useSession();
//   const [isHost, setIsHost] = React.useState(false);
//   const [showDotsMenu, setShowDotsMenu] = React.useState(false);
//   const [showHostPanel, setShowHostPanel] = React.useState(false);
//   const [showQuiz, setShowQuiz] = React.useState(false);
//   const [quizRoomName, setQuizRoomName] = React.useState('');

//   React.useEffect(() => {
//     const checkHost = async () => {
//       const res = await fetch(`/api/meeting/get?roomName=${props.connectionDetails.roomName}`);
//       const data = await res.json();
//       setIsHost(data.isHost);
//     };
//     checkHost();
//   }, [props.connectionDetails.roomName]);

//   const keyProvider = new ExternalE2EEKeyProvider();
//   const { worker, e2eePassphrase } = useSetupE2EE();
//   const e2eeEnabled = !!(e2eePassphrase && worker);
//   const [e2eeSetupComplete, setE2eeSetupComplete] = React.useState(false);

//   const roomOptions = React.useMemo((): RoomOptions => {
//     let videoCodec: VideoCodec | undefined = props.options.codec ? props.options.codec : 'vp9';
//     if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
//       videoCodec = undefined;
//     }
//     const videoCaptureDefaults: VideoCaptureOptions = {
//       deviceId: props.userChoices.videoDeviceId ?? undefined,
//       resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
//     };
//     const publishDefaults: TrackPublishDefaults = {
//       dtx: false,
//       videoSimulcastLayers: props.options.hq
//         ? [VideoPresets.h1080, VideoPresets.h720]
//         : [VideoPresets.h540, VideoPresets.h216],
//       red: !e2eeEnabled,
//       videoCodec,
//     };
//     return {
//       videoCaptureDefaults,
//       publishDefaults,
//       audioCaptureDefaults: { deviceId: props.userChoices.audioDeviceId ?? undefined },
//       adaptiveStream: true,
//       dynacast: true,
//       e2ee: keyProvider && worker && e2eeEnabled ? { keyProvider, worker } : undefined,
//     };
//   }, [props.userChoices, props.options.hq, props.options.codec]);

//   const room = React.useMemo(() => new Room(roomOptions), []);
//   const prevMutedRef = React.useRef<boolean | null>(null);

//   React.useEffect(() => {
//     if (e2eeEnabled) {
//       keyProvider
//         .setKey(decodePassphrase(e2eePassphrase))
//         .then(() => {
//           room.setE2EEEnabled(true).catch((e) => {
//             if (e instanceof DeviceUnsupportedError) {
//               alert(`You're trying to join an encrypted meeting, but your browser does not support it.`);
//               console.error(e);
//             } else {
//               throw e;
//             }
//           });
//         })
//         .then(() => setE2eeSetupComplete(true));
//     } else {
//       setE2eeSetupComplete(true);
//     }
//   }, [e2eeEnabled, room, e2eePassphrase]);

//   const connectOptions = React.useMemo((): RoomConnectOptions => {
//     return { autoSubscribe: true };
//   }, []);

//   // ATTENDANCE — fire leave API on disconnect
//   const handleAttendanceLeave = React.useCallback(() => {
//     const payload = JSON.stringify({ roomName: props.connectionDetails.roomName });
//     navigator.sendBeacon('/api/attendance/leave', payload);
//   }, [props.connectionDetails.roomName]);

//   React.useEffect(() => {
//     room.on(RoomEvent.Disconnected, handleOnLeave);
//     room.on(RoomEvent.EncryptionError, handleEncryptionError);
//     room.on(RoomEvent.MediaDevicesError, handleError);

//     window.addEventListener('beforeunload', handleAttendanceLeave);

//     if (e2eeSetupComplete) {
//       // ✅ ONLY connect here — do NOT manually call setCameraEnabled/setMicrophoneEnabled
//       // VideoConference component handles devices itself. Calling twice = NotReadableError
//       room.connect(
//         props.connectionDetails.serverUrl,
//         props.connectionDetails.participantToken,
//         connectOptions
//       ).catch((error) => handleError(error));
//     }

//     // Mute state polling
//     const muteInterval = setInterval(async () => {
//       try {
//         const res = await fetch(`/api/meeting/get?roomName=${props.connectionDetails.roomName}`);
//         const data = await res.json();
//         const shouldBeMuted = data.meeting?.isMuted;
//         const micPublication = room.localParticipant.getTrackPublication(Track.Source.Microphone);

//         if (shouldBeMuted === true) {
//           if (!micPublication?.isMuted) {
//             await room.localParticipant.setMicrophoneEnabled(false);
//           }
//         } else if (shouldBeMuted === false && prevMutedRef.current === true) {
//           await room.localParticipant.setMicrophoneEnabled(true);
//         }
//         prevMutedRef.current = shouldBeMuted;
//       } catch (err) {
//         console.error('Mute check error:', err);
//       }
//     }, 2000);

//     return () => {
//       room.off(RoomEvent.Disconnected, handleOnLeave);
//       room.off(RoomEvent.EncryptionError, handleEncryptionError);
//       room.off(RoomEvent.MediaDevicesError, handleError);
//       window.removeEventListener('beforeunload', handleAttendanceLeave);
//       clearInterval(muteInterval);
//     };
//   }, [e2eeSetupComplete, room, props.connectionDetails, props.userChoices, handleAttendanceLeave]);

//   const lowPowerMode = useLowCPUOptimizer(room);
//   const router = useRouter();

//   const handleOnLeave = React.useCallback(() => {
//     handleAttendanceLeave();
//     router.push('/');
//   }, [router, handleAttendanceLeave]);

//   const handleError = React.useCallback((error: Error) => {
//     console.error(error);
//   }, []);

//   const handleEncryptionError = React.useCallback((error: Error) => {
//     console.error(error);
//     alert(`Encountered an unexpected encryption error: ${error.message}`);
//   }, []);

//   React.useEffect(() => {
//     if (lowPowerMode) console.warn('Low power mode enabled');
//   }, [lowPowerMode]);

//   return (
//     <div className="lk-room-container">
//       <RoomContext.Provider value={room}>
//         <KeyboardShortcuts />
//         <VideoConference
//           chatMessageFormatter={formatChatMessageLinks}
//           SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
//         />
//         <DebugMode />
//         <RecordingIndicator />
//       </RoomContext.Provider>

//       {showQuiz && (
//         <div style={{
//           position: 'fixed', inset: 0,
//           backgroundColor: 'rgba(0,0,0,0.97)',
//           zIndex: 999999, overflow: 'auto',
//         }}>
//           <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
//             <button
//               onClick={() => setShowQuiz(false)}
//               style={{
//                 background: '#e74c3c', color: 'white',
//                 border: 'none', borderRadius: '8px',
//                 padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
//               }}
//             >
//               Back to Meeting
//             </button>
//           </div>
//           <iframe
//             src={`/quiz/${quizRoomName}`}
//             style={{ width: '100%', height: '100vh', border: 'none' }}
//           />
//         </div>
//       )}

//       {isHost && (
//         <>
//           <style>{`
//             .host-three-dots {
//               position: fixed; bottom: 14px; right: 14px; z-index: 99999;
//             }
//             .dots-trigger {
//               width: 44px; height: 44px; border-radius: 8px;
//               background: rgba(255,255,255,0.08);
//               border: 1px solid rgba(255,255,255,0.15);
//               color: white; font-size: 22px; cursor: pointer;
//               display: flex; align-items: center; justify-content: center;
//             }
//             .dots-trigger:hover { background: rgba(255,255,255,0.18); }
//             .dots-menu {
//               position: absolute; bottom: 52px; right: 0;
//               background: #1a1a2e; border: 1px solid rgba(255,255,255,0.15);
//               border-radius: 10px; padding: 6px; min-width: 190px;
//               box-shadow: 0 8px 32px rgba(0,0,0,0.5);
//             }
//             .dots-menu-title {
//               color: #4a90d9; font-size: 11px; font-weight: bold;
//               padding: 6px 12px 4px; text-transform: uppercase;
//               border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 4px;
//             }
//             .dots-menu button {
//               display: flex; align-items: center; gap: 10px; width: 100%;
//               background: transparent; border: none; color: white;
//               padding: 9px 12px; cursor: pointer; font-size: 13px;
//               border-radius: 7px; text-align: left;
//             }
//             .dots-menu button:hover { background: rgba(255,255,255,0.1); }
//           `}</style>

//           <div className="host-three-dots">
//             <button
//               className="dots-trigger"
//               onClick={() => {
//                 setShowDotsMenu(!showDotsMenu);
//                 setShowHostPanel(false);
//               }}
//             >
//               ⋮
//             </button>

//             {showDotsMenu && (
//               <div className="dots-menu">
//                 <div className="dots-menu-title">Host Controls</div>
//                 <button onClick={() => {
//                   setShowHostPanel(true);
//                   setShowDotsMenu(false);
//                 }}>
//                   Host Controls Panel
//                 </button>
//               </div>
//             )}
//           </div>

//           {showHostPanel && (
//             <HostPanel
//               roomName={props.connectionDetails.roomName}
//               onClose={() => setShowHostPanel(false)}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }


'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { HostPanel } from '@/lib/HostPanel';
import { io, Socket } from 'socket.io-client';
import { decodePassphrase } from '@/lib/client-utils';
import { DebugMode } from '@/lib/Debug';
import { KeyboardShortcuts } from '@/lib/KeyboardShortcuts';
import { RecordingIndicator } from '@/lib/RecordingIndicator';
import { SettingsMenu } from '@/lib/SettingsMenu';
import { ConnectionDetails } from '@/lib/types';
import {
  formatChatMessageLinks,
  LocalUserChoices,
  PreJoin,
  RoomContext,
  VideoConference,
} from '@livekit/components-react';
import {
  ExternalE2EEKeyProvider,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  Room,
  DeviceUnsupportedError,
  RoomConnectOptions,
  RoomEvent,
  TrackPublishDefaults,
  VideoCaptureOptions,
  Track,
} from 'livekit-client';
import { useRouter } from 'next/navigation';
import { useSetupE2EE } from '@/lib/useSetupE2EE';
import { useLowCPUOptimizer } from '@/lib/usePerfomanceOptimiser';

const CONN_DETAILS_ENDPOINT =
  process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';
const SHOW_SETTINGS_MENU = process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU == 'true';

export function PageClientImpl(props: {
  roomName: string;
  region?: string;
  hq: boolean;
  codec: VideoCodec;
}) {
  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(undefined);
  const preJoinDefaults = React.useMemo(() => {
    return { username: '', videoEnabled: true, audioEnabled: true };
  }, []);
  const [connectionDetails, setConnectionDetails] = React.useState<ConnectionDetails | undefined>(undefined);

  const handlePreJoinSubmit = React.useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);

    // Check if user is host
    const meetingRes = await fetch(`/api/meeting/get?roomName=${props.roomName}`);
    const meetingData = await meetingRes.json();
    const displayName = meetingData.isHost
      ? `${values.username} (Host)`
      : values.username;

    // ATTENDANCE — record join time
    try {
      await fetch('/api/attendance/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: props.roomName }),
      });
    } catch (err) {
      console.error('Attendance join error:', err);
    }

    const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
    url.searchParams.append('roomName', props.roomName);
    url.searchParams.append('participantName', displayName);
    if (props.region) {
      url.searchParams.append('region', props.region);
    }
    const connectionDetailsResp = await fetch(url.toString());
    const connectionDetailsData = await connectionDetailsResp.json();
    setConnectionDetails(connectionDetailsData);
  }, [props.roomName]);

  const handlePreJoinError = React.useCallback((e: any) => console.error(e), []);

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <VideoConferenceComponent
          roomName={props.roomName}
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ codec: props.codec, hq: props.hq }}
        />
      )}
    </main>
  );
}

function VideoConferenceComponent(props: {
  roomName: string;
  userChoices: LocalUserChoices;
  connectionDetails: ConnectionDetails;
  options: { hq: boolean; codec: VideoCodec };
}) {
  const { data: session } = useSession();
  const [isHost, setIsHost] = React.useState(false);
  const [showDotsMenu, setShowDotsMenu] = React.useState(false);
  const [showHostPanel, setShowHostPanel] = React.useState(false);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizRoomName, setQuizRoomName] = React.useState('');
  const [socket, setSocket] = React.useState<Socket | null>(null);

  // Check if current user is host
  React.useEffect(() => {
    const checkHost = async () => {
      const res = await fetch(`/api/meeting/get?roomName=${props.connectionDetails.roomName}`);
      const data = await res.json();
      setIsHost(data.isHost);
    };
    checkHost();
  }, [props.connectionDetails.roomName]);

  const keyProvider = new ExternalE2EEKeyProvider();
  const { worker, e2eePassphrase } = useSetupE2EE();
  const e2eeEnabled = !!(e2eePassphrase && worker);
  const [e2eeSetupComplete, setE2eeSetupComplete] = React.useState(false);

  const roomOptions = React.useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = props.options.codec ? props.options.codec : 'vp9';
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    const videoCaptureDefaults: VideoCaptureOptions = {
      deviceId: props.userChoices.videoDeviceId ?? undefined,
      resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
    };
    const publishDefaults: TrackPublishDefaults = {
      dtx: false,
      videoSimulcastLayers: props.options.hq
        ? [VideoPresets.h1080, VideoPresets.h720]
        : [VideoPresets.h540, VideoPresets.h216],
      red: !e2eeEnabled,
      videoCodec,
    };
    return {
      videoCaptureDefaults,
      publishDefaults,
      audioCaptureDefaults: { deviceId: props.userChoices.audioDeviceId ?? undefined },
      adaptiveStream: true,
      dynacast: true,
      e2ee: keyProvider && worker && e2eeEnabled ? { keyProvider, worker } : undefined,
    };
  }, [props.userChoices, props.options.hq, props.options.codec]);

  const room = React.useMemo(() => new Room(roomOptions), []);
  const prevMutedRef = React.useRef<boolean | null>(null);

  // ============================================
  // SOCKET.IO — Connect and handle live captions
  // ============================================
  React.useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);

    newSocket.on('live-caption', (data) => {
      console.log('Live caption:', data.text);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ============================================
  // SPEECH RECOGNITION — Transcription via Socket
  // ============================================
  React.useEffect(() => {
    if (!room || !socket || !e2eeSetupComplete) return;

    socket.emit('join-room', props.roomName);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any = null;
    let isRecordingIntent = false;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => console.log('🎙️ Speech Recognition Started');
      recognition.onerror = (event: any) => console.error('❌ Speech Error:', event.error);

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        console.log('🗣️ Captured:', transcript);

        if (socket.connected) {
          socket.emit('save-transcript', {
            meetingId: props.roomName,
            text: transcript,
          });
        } else {
          console.warn('⚠️ Socket disconnected, transcript not saved');
        }
      };

      recognition.onend = () => {
        if (isRecordingIntent) {
          try { recognition.start(); } catch (e) {}
        }
      };
    } else {
      console.error('❌ Speech Recognition API not supported in this browser.');
    }

    room.on(RoomEvent.LocalTrackPublished, (track) => {
      if (track.source === Track.Source.Microphone) {
        isRecordingIntent = true;
        if (recognition) recognition.start();
      }
    });

    room.on(RoomEvent.LocalTrackUnpublished, (track) => {
      if (track.source === Track.Source.Microphone) {
        isRecordingIntent = false;
        if (recognition) recognition.stop();
      }
    });

    if (room.localParticipant.isMicrophoneEnabled) {
      isRecordingIntent = true;
      if (recognition) recognition.start();
    }

    return () => {
      isRecordingIntent = false;
      if (recognition) recognition.stop();
    };
  }, [room, socket, e2eeSetupComplete, props.roomName]);

  // ============================================
  // E2EE SETUP
  // ============================================
  React.useEffect(() => {
    if (e2eeEnabled) {
      keyProvider
        .setKey(decodePassphrase(e2eePassphrase))
        .then(() => {
          room.setE2EEEnabled(true).catch((e) => {
            if (e instanceof DeviceUnsupportedError) {
              alert(`You're trying to join an encrypted meeting, but your browser does not support it.`);
              console.error(e);
            } else {
              throw e;
            }
          });
        })
        .then(() => setE2eeSetupComplete(true));
    } else {
      setE2eeSetupComplete(true);
    }
  }, [e2eeEnabled, room, e2eePassphrase]);

  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return { autoSubscribe: true };
  }, []);

  // ATTENDANCE — fire leave API on disconnect
  const handleAttendanceLeave = React.useCallback(() => {
    const payload = JSON.stringify({ roomName: props.connectionDetails.roomName });
    navigator.sendBeacon('/api/attendance/leave', payload);
  }, [props.connectionDetails.roomName]);

  // ============================================
  // ROOM CONNECTION + MUTE POLLING
  // ============================================
  React.useEffect(() => {
    room.on(RoomEvent.Disconnected, handleOnLeave);
    room.on(RoomEvent.EncryptionError, handleEncryptionError);
    room.on(RoomEvent.MediaDevicesError, handleError);

    window.addEventListener('beforeunload', handleAttendanceLeave);

    if (e2eeSetupComplete) {
      // ✅ ONLY connect here — VideoConference handles devices itself
      room.connect(
        props.connectionDetails.serverUrl,
        props.connectionDetails.participantToken,
        connectOptions,
      ).catch((error) => handleError(error));
    }

    // Mute state polling — checks every 2s if host has muted everyone
    const muteInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/meeting/get?roomName=${props.connectionDetails.roomName}`);
        const data = await res.json();
        const shouldBeMuted = data.meeting?.isMuted;
        const micPublication = room.localParticipant.getTrackPublication(Track.Source.Microphone);

        if (shouldBeMuted === true) {
          if (!micPublication?.isMuted) {
            await room.localParticipant.setMicrophoneEnabled(false);
          }
        } else if (shouldBeMuted === false && prevMutedRef.current === true) {
          await room.localParticipant.setMicrophoneEnabled(true);
        }
        prevMutedRef.current = shouldBeMuted;
      } catch (err) {
        console.error('Mute check error:', err);
      }
    }, 2000);

    return () => {
      room.off(RoomEvent.Disconnected, handleOnLeave);
      room.off(RoomEvent.EncryptionError, handleEncryptionError);
      room.off(RoomEvent.MediaDevicesError, handleError);
      window.removeEventListener('beforeunload', handleAttendanceLeave);
      clearInterval(muteInterval);
    };
  }, [e2eeSetupComplete, room, props.connectionDetails, props.userChoices, handleAttendanceLeave]);

  const lowPowerMode = useLowCPUOptimizer(room);
  const router = useRouter();

  const handleOnLeave = React.useCallback(() => {
    handleAttendanceLeave();
    router.push('/');
  }, [router, handleAttendanceLeave]);

  const handleError = React.useCallback((error: Error) => {
    console.error(error);
  }, []);

  const handleEncryptionError = React.useCallback((error: Error) => {
    console.error(error);
    alert(`Encountered an unexpected encryption error: ${error.message}`);
  }, []);

  React.useEffect(() => {
    if (lowPowerMode) console.warn('Low power mode enabled');
  }, [lowPowerMode]);

  return (
    <div className="lk-room-container">
      <RoomContext.Provider value={room}>
        <KeyboardShortcuts />
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
        />
        <DebugMode />
        <RecordingIndicator />
      </RoomContext.Provider>

      {/* Quiz Overlay */}
      {showQuiz && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.97)',
          zIndex: 999999, overflow: 'auto',
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button
              onClick={() => setShowQuiz(false)}
              style={{
                background: '#e74c3c', color: 'white',
                border: 'none', borderRadius: '8px',
                padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
              }}
            >
              Back to Meeting
            </button>
          </div>
          <iframe
            src={`/quiz/${quizRoomName}`}
            style={{ width: '100%', height: '100vh', border: 'none' }}
          />
        </div>
      )}

      {/* Host Controls */}
      {isHost && (
        <>
          <style>{`
            .host-three-dots {
              position: fixed; bottom: 14px; right: 14px; z-index: 99999;
            }
            .dots-trigger {
              width: 44px; height: 44px; border-radius: 8px;
              background: rgba(255,255,255,0.08);
              border: 1px solid rgba(255,255,255,0.15);
              color: white; font-size: 22px; cursor: pointer;
              display: flex; align-items: center; justify-content: center;
            }
            .dots-trigger:hover { background: rgba(255,255,255,0.18); }
            .dots-menu {
              position: absolute; bottom: 52px; right: 0;
              background: #1a1a2e; border: 1px solid rgba(255,255,255,0.15);
              border-radius: 10px; padding: 6px; min-width: 190px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            }
            .dots-menu-title {
              color: #4a90d9; font-size: 11px; font-weight: bold;
              padding: 6px 12px 4px; text-transform: uppercase;
              border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 4px;
            }
            .dots-menu button {
              display: flex; align-items: center; gap: 10px; width: 100%;
              background: transparent; border: none; color: white;
              padding: 9px 12px; cursor: pointer; font-size: 13px;
              border-radius: 7px; text-align: left;
            }
            .dots-menu button:hover { background: rgba(255,255,255,0.1); }
          `}</style>

          <div className="host-three-dots">
            <button
              className="dots-trigger"
              onClick={() => {
                setShowDotsMenu(!showDotsMenu);
                setShowHostPanel(false);
              }}
            >
              ⋮
            </button>

            {showDotsMenu && (
              <div className="dots-menu">
                <div className="dots-menu-title">Host Controls</div>
                <button onClick={() => {
                  setShowHostPanel(true);
                  setShowDotsMenu(false);
                }}>
                  Host Controls Panel
                </button>
              </div>
            )}
          </div>

          {showHostPanel && (
            <HostPanel
              roomName={props.connectionDetails.roomName}
              onClose={() => setShowHostPanel(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
