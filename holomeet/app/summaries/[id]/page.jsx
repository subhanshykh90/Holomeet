// summary/[id]/page.jsx 

// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function SummaryDetail() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/meetings/${id}`);
//         const resjson = await res.json();
//         setData(resjson);
//       } catch (err) {
//         console.error("Error fetching summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`http://localhost:5000/api/summary/${id}/generate`);
//       setData(prev => ({ 
//         ...prev, 
//         summary: res.data.summary, 
//       }));
//       alert("AI Summary Updated!");
//     } catch (err) {
//       alert("Failed to generate summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-10 text-white bg-[#0a0f2c] min-h-screen">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-[#0a0f2c] text-white p-6">
//       <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
//         <h1 className="text-2xl font-bold text-blue-400">🤖 AI Assistant</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* LEFT SIDE: Transcript */}
//         <div className="lg:col-span-2">
//           <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5">
//             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📑 Transcription</h2>
//             <div className="h-[450px] overflow-y-auto bg-black/20 p-4 rounded-lg custom-scrollbar">
//               {data?.transcriptText || data?.transcription ? (
//                 <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
//                   {data.transcriptText || data.transcription}
//                 </p>
//               ) : (
//                 <p className="text-gray-500 italic py-10 text-center">No transcript available.</p>
//               )}
//             </div>
//             <button 
//               onClick={handleGenerate} 
//               className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition shadow-lg"
//             >
//               Generate AI Summary
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Title & Summary */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-[#1e293b] to-[#16213e] p-6 rounded-2xl border border-blue-500/30">
//             <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Meeting Title</p>
//             <h2 className="text-xl font-bold">
//               {data?.summary?.mainTopic || data?.title || "Session Analysis"}
//             </h2>
//           </div>

//           <div className="bg-[#16213e] p-6 rounded-2xl border border-white/5 min-h-[180px]">
//             <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">✨ AI Recap</h2>
//             {data?.summary?.shortOverview ? (
//               <p className="text-gray-200 text-sm leading-relaxed italic">
//                 "{data.summary.shortOverview}"
//               </p>
//             ) : (
//               <p className="text-gray-500 text-sm italic">
//                 Click the blue button to generate a 3-line recap.
//               </p>
//             )}
//           </div>

//           {/* Export links */}
//           {/* Enhanced Export Buttons */}
// <div className="space-y-3">
//   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-1">Export Results</p>
//   <div className="flex flex-col gap-3">
//     <button 
//       onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/pdf`)} 
//       className="flex items-center justify-center gap-3 w-full bg-[#ff4d4d]/10 hover:bg-[#ff4d4d]/20 border border-[#ff4d4d]/30 text-[#ff4d4d] py-3 rounded-xl font-semibold transition-all duration-300 group"
//     >
//       <span className="text-lg group-hover:scale-110 transition-transform">📄</span>
//       Export as PDF
//     </button>
    
//     <button 
//       onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/docx`)} 
//       className="flex items-center justify-center gap-3 w-full bg-[#2b579a]/10 hover:bg-[#2b579a]/20 border border-[#2b579a]/30 text-blue-400 py-3 rounded-xl font-semibold transition-all duration-300 group"
//     >
//       <span className="text-lg group-hover:scale-110 transition-transform">📝</span>
//       Export as Word
//     </button>
//   </div>
// </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function SummaryDetail() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/meetings/${id}`);
//         const resjson = await res.json();
//         setData(resjson);
//       } catch (err) {
//         console.error("Error fetching summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`http://localhost:5000/api/summary/${id}/generate`);
//       setData(prev => ({ ...prev, summary: res.data.summary }));
//       alert("Summary Generated: Filtered out the 'fazool behas'!");
//     } catch (err) {
//       alert("Failed to generate summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-10 text-blue-400 bg-[#0a0f2c] min-h-screen font-bold">Loading Analysis...</div>;

//   return (
//     <div className="min-h-screen bg-[#0a0f2c] text-white p-6">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-white/10 pb-4">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.push('/summaries')} className="text-gray-400 hover:text-white transition text-sm">← Back</button>
//           <h1 className="text-2xl font-bold text-blue-400">🤖 AI Meeting Intelligence</h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* LEFT SIDE: Transcription (Takes 2/3 of space) */}
//         <div className="lg:col-span-2">
//           <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5 shadow-xl">
//             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📑 Full Transcription</h2>
//             <div className="h-[500px] overflow-y-auto bg-black/20 p-5 rounded-xl border border-white/5 custom-scrollbar">
//               {data?.transcriptText || data?.transcription ? (
//                 <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
//                   {data.transcriptText || data.transcription}
//                 </p>
//               ) : (
//                 <p className="text-gray-500 italic text-center py-20">No transcript available.</p>
//               )}
//             </div>
//             <button 
//               onClick={handleGenerate} 
//               className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition shadow-lg active:scale-95"
//             >
//               ✨ Generate Professional AI Summary
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Title, AI Recap & Exports (Takes 1/3 of space) */}
//         <div className="space-y-6">
//           {/* Title Card */}
//           <div className="bg-gradient-to-br from-[#1e293b] to-[#16213e] p-6 rounded-2xl border border-blue-500/30">
//             <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Meeting Context</p>
//             <h2 className="text-xl font-bold">{data?.summary?.mainTopic || data?.title || "Session Analysis"}</h2>
//           </div>

//           {/* AI Recap Card - Only shows actual summary, no transcript overlap */}
//           <div className="bg-[#16213e] p-6 rounded-2xl border border-white/5 min-h-[220px] shadow-xl">
//             <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">✨ AI Executive Recap</h2>
//             {data?.summary?.status === 'completed' && data?.summary?.shortOverview ? (
//               <p className="text-gray-200 text-sm leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
//                 "{data.summary.shortOverview}"
//               </p>
//             ) : (
//               <p className="text-gray-500 text-sm italic py-4">
//                 Click generate to remove background noise and extract useful text.
//               </p>
//             )}
//           </div>

//           {/* Export Buttons */}
//           <div className="bg-[#16213e]/50 p-6 rounded-2xl border border-white/5 space-y-4">
//             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Export Results</p>
//             <button 
//               onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/pdf`)} 
//               className="flex items-center justify-center gap-3 w-full bg-[#ff4d4d]/10 hover:bg-[#ff4d4d]/20 border border-[#ff4d4d]/30 text-[#ff4d4d] py-3 rounded-xl font-semibold transition"
//             >
//               📄 Export as PDF
//             </button>
//             <button 
//               onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/docx`)} 
//               className="flex items-center justify-center gap-3 w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-semibold transition"
//             >
//               📝 Export as Word
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SummaryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/meetings/${id}`);
        const resjson = await res.json();
        setData(resjson);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/summary/${id}/generate`);
      // Update state with newly generated summary and text
      setData(prev => ({ 
        ...prev, 
        summary: res.data.summary,
        transcriptText: res.data.summary.transcriptText // Ensure text updates if backend changed it
      }));
      alert("Summary Generated Successfully: !");
    } catch (err) {
      alert("Failed to generate summary. Please check backend API logs.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-blue-400 bg-[#0a0f2c] min-h-screen font-bold">Loading Analysis...</div>;

  // LOGIC FIX: Extract transcript text. If `transcriptText` is not ready yet, 
  // check if `transcriptChunks` array exists and join it.
  const rawTranscript = data?.transcriptText 
    || (data?.transcriptChunks?.length > 0 ? data.transcriptChunks.join(" ") : "") 
    || data?.transcription;

  return (
    <div className="min-h-screen bg-[#0a0f2c] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/summaries')} className="text-gray-400 hover:text-white transition text-sm">← Back</button>
          <h1 className="text-2xl font-bold text-blue-400">🤖 AI Meeting Intelligence</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE: Transcription */}
        <div className="lg:col-span-2">
          <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5 shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📑 Full Transcription</h2>
            <div className="h-[500px] overflow-y-auto bg-black/20 p-5 rounded-xl border border-white/5 custom-scrollbar">
              {rawTranscript ? (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {rawTranscript}
                </p>
              ) : (
                <p className="text-gray-500 italic text-center py-20">No transcript available yet. Start the meeting and speak to generate chunks.</p>
              )}
            </div>
            <button 
              onClick={handleGenerate} 
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition shadow-lg active:scale-95"
            >
              ✨ Generate AI Summary
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Title, AI Recap & Exports */}
        <div className="space-y-6">
          {/* Title Card */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#16213e] p-6 rounded-2xl border border-blue-500/30">
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Meeting Context</p>
            <h2 className="text-xl font-bold">{data?.summary?.mainTopic || data?.title || "Session Analysis"}</h2>
          </div>

          {/* AI Recap Card */}
          <div className="bg-[#16213e] p-6 rounded-2xl border border-white/5 min-h-[220px] shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">✨ AI Executive Recap</h2>
            
            {/* Logic: Only show summary if it exists AND is not just a copy of the raw transcript (indicating API failure) */}
            {data?.summary?.status === 'completed' && data?.summary?.shortOverview ? (
              <p className="text-gray-200 text-sm leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                "{data.summary.shortOverview}"
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic py-4">
                Raw data collected. Click "Generate Professional AI Summary" button to remove background noise and extract useful text.
              </p>
            )}
          </div>

          {/* Export Buttons */}
          <div className="bg-[#16213e]/50 p-6 rounded-2xl border border-white/5 space-y-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Export Results</p>
            <button 
              onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/pdf`)} 
              className="flex items-center justify-center gap-3 w-full bg-[#ff4d4d]/10 hover:bg-[#ff4d4d]/20 border border-[#ff4d4d]/30 text-[#ff4d4d] py-3 rounded-xl font-semibold transition"
            >
              📄 Export as PDF
            </button>
            <button 
              onClick={() => window.open(`http://localhost:5000/api/summary/${id}/download/docx`)} 
              className="flex items-center justify-center gap-3 w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-semibold transition"
            >
              📝 Export as Word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}