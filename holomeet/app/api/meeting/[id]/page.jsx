// // //meeting/id/page.jsx
// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import io from "socket.io-client";
// import { useRouter } from 'next/navigation';

// export default function MeetingPage({ params }) {
//   const { id } = params; 
//   const router = useRouter();

//   // State Management
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [liveCaptions, setLiveCaptions] = useState([]);
  
//   // Refs for persistent objects
//   const socketRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   // 1. Initialize Socket Connection
//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000", {
//       transports: ["websocket"], 
//     });

//     socketRef.current.on("live-caption", (data) => {
//       if (data.text) {
//         setLiveCaptions((prev) => [...prev, data.text]);
//       }
//     });
  
//     socketRef.current.on("connect_error", (err) => {
//       console.error("Socket Connection Error:", err);
//     });

//     return () => {
//       stopStreaming();
//       if (socketRef.current) socketRef.current.disconnect();
//     };
//   }, []);

//   // 2. Stop Streaming Logic (Crucial for clean exit)
//   const stopStreaming = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//     }
//     if (socketRef.current && socketRef.current.connected) {
//       socketRef.current.emit("stop-meeting", { meetingId: id });
//     }
//     setIsRecording(false);
//     console.log("🛑 Voice capture stopped.");
//   };

//   // 3. Start Streaming Voice
//   const startStreaming = async () => {
//     try {
//       if (!socketRef.current.connected) {
//         socketRef.current.connect();
//       }

//       socketRef.current.emit("join-room", id);
//       await new Promise(resolve => setTimeout(resolve, 100));
//       socketRef.current.emit("start-meeting", { meetingId: id });

//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         } 
//       });

//       const options = { mimeType: 'audio/webm;codecs=opus' };
//       mediaRecorderRef.current = new MediaRecorder(stream, options);

//       mediaRecorderRef.current.ondataavailable = (e) => {
//         if (e.data.size > 0 && socketRef.current.connected) {
//           socketRef.current.emit("audio-data", e.data);
//         }
//       };

//       mediaRecorderRef.current.start(250);
//       setIsRecording(true);
//       console.log("🎙️ Voice capture started...");
//     } catch (err) {
//       console.error("Microphone access denied:", err);
//       alert("Microphone access is required.");
//     }
//   };

//   // 4. Final Step: End Meeting & Redirect to Dashboard
//   const handleEndAndSummarize = async () => {
//     try {
//       stopStreaming();
//       setIsGenerating(true);

//       const response = await axios.post(`http://localhost:5000/api/summary/${id}/generate`);
      
//       if (response.data.success) {
//         alert("Summary Generated successfully!");
//         // Redirecting to Dashboard instead of summary page
//         router.push('/dashboard'); 
//       }
//     } catch (error) {
//       console.error("Summary Generation Error:", error);
//       const errorMsg = error.response?.data?.error || "Failed to generate summary.";
//       alert(errorMsg);
//       // Even if summary fails, we should probably allow them to go back to dashboard
//       router.push('/dashboard');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 min-h-screen bg-slate-50">
//       <div className="w-full max-w-4xl flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-slate-800">Meeting Room: <span className="text-blue-600">{id}</span></h1>
//         <div className="flex items-center gap-2">
//           <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-gray-300'}`}></div>
//           <span className="text-sm font-medium text-slate-500">{isRecording ? "Live Transcribing" : "Idle"}</span>
//         </div>
//       </div>

//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 mb-8 h-80 overflow-y-auto border border-slate-200">
//         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Real-time Feed</h3>
//         <div className="text-slate-700 leading-relaxed text-lg">
//           {liveCaptions.length > 0 ? (
//             liveCaptions.map((text, i) => <span key={i} className="mr-1">{text}</span>)
//           ) : (
//             <p className="text-slate-400 italic">Waiting for audio input...</p>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center gap-6">
//         {!isRecording ? (
//           <button
//             onClick={startStreaming}
//             className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
//           >
//             Start Voice Capture
//           </button>
//         ) : (
//           <button
//             onClick={stopStreaming}
//             className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95"
//           >
//             Stop Capturing
//           </button>
//         )}

//         <button
//           onClick={handleEndAndSummarize}
//           disabled={isGenerating}
//           className={`px-10 py-4 rounded-xl font-bold text-white shadow-2xl transition-all active:scale-95 ${
//             isGenerating 
//             ? 'bg-slate-400 cursor-not-allowed' 
//             : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
//           }`}
//         >
//           {isGenerating ? "Generating Report..." : "End & Go to Dashboard"}
//         </button>
//       </div>
//     </div> 
//   );
// }
// /meeting/[id]/page.jsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from "socket.io-client";
import { useRouter } from 'next/navigation';

export default function MeetingPage({ params }) {
  const { id } = params; 
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveCaptions, setLiveCaptions] = useState([]);
  
  // ============================================
  // REFS FOR PERSISTENT OBJECTS
  // ============================================
  const socketRef = useRef(null);
  const recognitionRef = useRef(null); // Changed from MediaRecorder to SpeechRecognition

  // ============================================
  // 1. INITIALIZE SOCKET CONNECTION
  // ============================================
  useEffect(() => {
    // Connect to your backend WebSocket server
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket"], 
    });

    // Listen for live captions being broadcasted from the server
    socketRef.current.on("live-caption", (data) => {
      if (data.text) {
        setLiveCaptions((prev) => [...prev, data.text]);
      }
    });
  
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err);
    });

    // Cleanup function when component unmounts
    return () => {
      stopStreaming();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // ============================================
  // 2. STOP STREAMING LOGIC
  // ============================================
  const stopStreaming = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop Speech-to-Text
    }
    
    setIsRecording(false);
    console.log("🛑 Voice capture and transcription stopped.");
  };

  // ============================================
  // 3. START STREAMING & SPEECH-TO-TEXT
  // ============================================
  const startStreaming = async () => {
    try {
      // Ensure socket is connected before starting
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }

      // Join the specific meeting room
      socketRef.current.emit("join-room", id);
      
      // Initialize Web Speech API for browser-based transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Please use Chrome.");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening continuously
      recognitionRef.current.interimResults = false; // Only send final recognized words
      recognitionRef.current.lang = 'en-US';

      // Event listener: Triggered every time the user finishes a sentence/phrase
      recognitionRef.current.onresult = (event) => {
        const currentTranscriptIndex = event.resultIndex;
        const transcriptChunk = event.results[currentTranscriptIndex][0].transcript.trim();

        if (transcriptChunk && socketRef.current.connected) {
          // Instantly send the generated text to the backend database via WebSocket
          socketRef.current.emit("save-transcript", { 
            meetingId: id, 
            text: transcriptChunk 
          });
          
          // Also update local state so the speaker sees their own words instantly
          setLiveCaptions((prev) => [...prev, transcriptChunk]);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognitionRef.current.start();
      setIsRecording(true);
      console.log("🎙️ Voice capture and live transcription started...");

    } catch (err) {
      console.error("Microphone access denied or error occurred:", err);
      alert("Microphone access is required.");
    }
  };

  // ============================================
  // 4. END MEETING & REDIRECT
  // ============================================
  const handleEndAndSummarize = async () => {
    try {
      stopStreaming();
      setIsGenerating(true);

      // Trigger the backend to generate the AI summary from the saved chunks
      const response = await axios.post(`http://localhost:5000/api/summary/${id}/generate`);
      
      if (response.data.success) {
        alert("Summary Generated successfully!");
        router.push('/dashboard'); 
      }
    } catch (error) {
      console.error("Summary Generation Error:", error);
      const errorMsg = error.response?.data?.error || "Failed to generate summary.";
      alert(errorMsg);
      router.push('/dashboard');
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================
  // UI RENDERING
  // ============================================
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Meeting Room: <span className="text-blue-600">{id}</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-medium text-slate-500">
            {isRecording ? "Live Transcribing" : "Idle"}
          </span>
        </div>
      </div>

      {/* Real-time Caption Box */}
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 mb-8 h-80 overflow-y-auto border border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Real-time Feed</h3>
        <div className="text-slate-700 leading-relaxed text-lg">
          {liveCaptions.length > 0 ? (
            liveCaptions.map((text, i) => <span key={i} className="mr-1">{text}.</span>)
          ) : (
            <p className="text-slate-400 italic">Waiting for audio input...</p>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        {!isRecording ? (
          <button
            onClick={startStreaming}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
          >
            Start Voice Capture
          </button>
        ) : (
          <button
            onClick={stopStreaming}
            className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95"
          >
            Stop Capturing
          </button>
        )}

        <button
          onClick={handleEndAndSummarize}
          disabled={isGenerating}
          className={`px-10 py-4 rounded-xl font-bold text-white shadow-2xl transition-all active:scale-95 ${
            isGenerating 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
          }`}
        >
          {isGenerating ? "Generating Report..." : "End & Go to Dashboard"}
        </button>
      </div>
    </div> 
  );
}