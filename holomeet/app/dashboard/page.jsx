// // 
// "use client";
// import React, { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { useSession } from "next-auth/react";
// import { generateRoomId } from '@/lib/client-utils';
// export default function Dashboard() {
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [requiredDuration, setRequiredDuration] = useState("");

//   const router = useRouter();
//   const { data: session } = useSession();

//   // Start meeting function (existing — unchanged)
//   const startMeeting = async (roomId) => {
//     router.push(`/rooms/${roomId}`);
//   };
//   const openprofilepage = () => {
//     router.push(`/profile`);
//   };

//   // Optional: join page
//   const join = () => {
//     router.push(`/join`);
//   };

//   // Save meeting info then start meeting
//   const Save_Meeting_info = async () => {
//     if (!title.trim() || !date.trim() || !description.trim()) {
//       alert("Please fill all fields");
//       return;
//     }

//     // ✅ FIX 2 — validate requiredDuration
//     if (!requiredDuration || Number(requiredDuration) < 1) {
//       alert("Please enter required attendance duration (minimum 1 minute)");
//       return;
//     }

//     setLoading(true);
//     try {
//       const roomId = generateRoomId();

//       // ✅ FIX 3 — save to your Next.js meeting API with requiredDuration
//       //    This replaces the localhost:5000 call so requiredDuration is saved in MongoDB
//       const res = await fetch("/api/meeting/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           roomName: roomId,
//           title,
//           date,
//           description,
//           requiredDuration: Number(requiredDuration), // ✅ saved to Meeting model
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         console.log("Meeting saved:", data);
//         startMeeting(roomId);
//       } else {
//         alert("Error saving meeting: " + data.error);
//       }
//     } catch (err) {
//       console.error("Server error:", err);
//       alert("Server error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="flex min-h-screen text-white"
//       style={{
//         background: "linear-gradient(to bottom right, #0a0f2c, #081a3a)",
//       }}
//     >
//       {/* Sidebar */}
//       <aside
//         className="hidden md:flex flex-col w-64 p-6 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]"
//         style={{
//           borderRight: "1px solid rgba(255,255,255,0.1)",
//         }}
//       >
//         <h2 className="text-xl font-bold mb-1">Virtual Classroom</h2>
//         <p className="text-sm text-gray-400 mb-8">AI-POWERED PLATFORM</p>

//         <nav className="space-y-6 mt-7">
//           <a href="#" className="flex items-center text-blue-400 font-semibold">
//             <span className="mr-2">📊</span> Dashboard
//           </a>
//           <a href="#" className="flex items-center hover:text-blue-400">
//             <span className="mr-2">➕</span> Create Meeting
//           </a>
//           <a href="#" className="flex items-center hover:text-blue-400">
//             <span className="mr-2">🗓️</span> Join Meeting
//           </a>
//           <a href="#" className="flex items-center hover:text-blue-400">
//             <span className="mr-2">⭐</span> Summaries
//           </a>
//           <a href="#" className="flex items-center hover:text-blue-400">
//             <span className="mr-2">⚙️</span> Home
//           </a>
//           <button
//             onClick={() => openprofilepage()}
//             className="flex items-center hover:text-blue-400"
//           >
//             <span className="mr-2" >👤</span> Profile
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 md:p-10 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
//         {/* Header */}
//         <div
//           className="flex mt-4 flex-col md:flex-row justify-between items-start md:items-center mb-8"
//           style={{
//             borderBottom: "1px solid rgba(255,255,255,0.1)",
//             paddingBottom: "1rem",
//           }}
//         >
//           <div>
//             <h1 className="text-3xl md:text-2xl font-bold text-blue-400">
//               Welcome back, {session?.user?.name || "User"}!
//             </h1>

//             <p className="text-gray-300 text-sm mt-2">
//               Ready to start your virtual classroom experience?
//             </p>
//           </div>

//           <div className="flex items-center space-x-4 mt-4 md:mt-0">
//             <div className="text-right">
//               <p className="font-semibold text-white">{session?.user?.name || "User"}</p>
//               <p className="text-gray-400 text-sm">Student • {session?.user?.email || ""}</p>
//             </div>
//             <div
//               className="flex items-center justify-center text-lg font-bold curser-pointer"
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "50%",
//                 backgroundColor: "#2563eb",
//               }}
//             >
//               SS
//             </div>
//           </div>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <div
//             className="p-6 rounded-2xl shadow-lg"
//             style={{
//               background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
//               minHeight: "280px",
//             }}
//           >
//             <h3 className="text-5xl font-bold text-blue-400 mb-2">3</h3>
//             <h3 className="text-lg font-semibold">No of Meetings Today</h3>
//             <p className="text-gray-400 text-sm mt-1">
//               Active sessions scheduled for today
//             </p>
//           </div>

//           <div
//             className="p-6 rounded-2xl shadow-lg"
//             style={{
//               background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
//               minHeight: "280px",
//             }}
//           >
//             <h3 className="text-5xl font-bold text-blue-400 mb-2">12</h3>
//             <h3 className="text-lg font-semibold">
//               No of Meetings Scheduled in Month
//             </h3>
//             <p className="text-gray-400 text-sm mt-1">
//               Upcoming sessions this month
//             </p>
//           </div>

//           <div
//             className="p-6 rounded-2xl shadow-lg"
//             style={{
//               background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
//               minHeight: "280px",
//             }}
//           >
//             <h3 className="text-5xl font-bold text-blue-400 mb-2">8</h3>
//             <h3 className="text-lg font-semibold">AI Summary Reports</h3>
//             <p className="text-gray-400 text-sm mt-1">
//               Generated meeting summaries available
//             </p>
//           </div>
//         </div>

//         {/* Modal Trigger Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center mt-17">
//           <button
//             onClick={() => setOpenModal(true)}
//             className="font-semibold px-6 py-3 rounded-xl shadow-lg text-white w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
//           >
//             Create Meeting
//           </button>
//           <button
//             onClick={join}
//             className="font-semibold px-6 py-3 rounded-xl shadow-lg border border-blue-500 text-blue-400 w-full sm:w-auto"
//             style={{ backgroundColor: "transparent" }}
//           >
//             Join Meeting
//           </button>
//         </div>
//       </main>

//       {/* Modal */}
//       {openModal && (
//         <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-slate-900 border border-blue-600 rounded-2xl p-6 w-11/12 max-w-md">
//             <h2 className="text-xl font-semibold mb-4 text-blue-400">
//               Create New Meeting
//             </h2>
//             <form className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Meeting Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
//               />

//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
//               />

//               {/* ✅ FIX 1 — requiredDuration now has state, so this works */}
//               <input
//                 type="number"
//                 min="1"
//                 placeholder="Required attendance duration "
//                 value={requiredDuration}
//                 onChange={(e) => setRequiredDuration(e.target.value)}
//                 className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
//               />

//               <textarea
//                 placeholder="Description"
//                 rows="3"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               ></textarea>

//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpenModal(false)}
//                   className="px-4 py-2 rounded-md text-gray-400 border border-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={Save_Meeting_info}
//                   disabled={loading}
//                   className="px-8 py-2 rounded-md text-white"
//                   style={{ background: "linear-gradient(to right, #2563eb, #3b82f6)" }}
//                 >
//                   {loading ? "Starting..." : "Start"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { generateRoomId } from '@/lib/client-utils';
import { useLoading } from "@/Components/LoadingProvider";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const { setLoading } = useLoading();

  const startMeeting = (roomId) => {
    setLoading(true);
    router.push(`/rooms/${roomId}`);
  };

  const join = () => {
    setLoading(true);
    router.push(`/join`);
  };

  const goToProfile = () => {
    setLoading(true);
    router.push(`/profile`);
  };

  const goToHome = () => {
    setLoading(true);
    router.push(`/`);
  };

  const goToSummaries = () => {
    setLoading(true);
    router.push(`/summaries`);
  };

  const Save_Meeting_info = async () => {
    if (!title.trim() || !date.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLocalLoading(true);
    try {
      const roomId = generateRoomId();
      const res = await fetch("/api/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName: roomId, title, date, description }),
      });
      const data = await res.json();
      if (res.ok) {
        startMeeting(roomId);
      } else {
        alert("Error saving meeting: " + data.error);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen text-white"
      style={{ background: "linear-gradient(to bottom right, #0a0f2c, #081a3a)" }}
    >
      {/* ===== SIDEBAR ===== */}
      <aside
        className="hidden md:flex flex-col w-64 p-6 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]"
        style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-xl font-bold mb-1">Virtual Classroom</h2>
        <p className="text-sm text-gray-400 mb-8">AI-POWERED PLATFORM</p>

        <nav className="space-y-6 mt-7">
          <button onClick={goToHome} className="flex items-center w-full text-left hover:text-blue-400">
            <span className="mr-2">⚙️</span> Home
          </button>
          <button className="flex items-center w-full text-left text-blue-400 font-semibold cursor-default">
            <span className="mr-2">📊</span> Dashboard
          </button>
          <button onClick={() => setOpenModal(true)} className="flex items-center w-full text-left hover:text-blue-400">
            <span className="mr-2">➕</span> Create Meeting
          </button>
          <button onClick={join} className="flex items-center w-full text-left hover:text-blue-400">
            <span className="mr-2">🗓️</span> Join Meeting
          </button>
          <button onClick={goToSummaries} className="flex items-center w-full text-left hover:text-blue-400">
            <span className="mr-2">⭐</span> Summaries
          </button>
          <button onClick={goToProfile} className="flex items-center w-full text-left hover:text-blue-400">
            <span className="mr-2">👤</span> Profile
          </button>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 md:p-10 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
        <div
          className="flex mt-4 flex-col md:flex-row justify-between items-start md:items-center mb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}
        >
          <div>
            <h1 className="text-3xl md:text-2xl font-bold text-blue-400">
              Welcome back, {session?.user?.name || "User"}!
            </h1>
            <p className="text-gray-300 text-sm mt-2">
              Ready to start your virtual classroom experience?
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right">
              <p className="font-semibold text-white">{session?.user?.name || "User"}</p>
              <p className="text-gray-400 text-sm">Student • {session?.user?.email || ""}</p>
            </div>
            <div
              onClick={goToProfile}
              className="flex items-center justify-center text-lg font-bold cursor-pointer hover:opacity-80 transition"
              style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2563eb" }}
            >
              SS
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl shadow-lg" style={{ background: "linear-gradient(to bottom right, #121e3d, #0f2a52)", minHeight: "280px" }}>
            <h3 className="text-5xl font-bold text-blue-400 mb-2">3</h3>
            <h3 className="text-lg font-semibold">No of Meetings Today</h3>
            <p className="text-gray-400 text-sm mt-1">Active sessions scheduled for today</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg" style={{ background: "linear-gradient(to bottom right, #121e3d, #0f2a52)", minHeight: "280px" }}>
            <h3 className="text-5xl font-bold text-blue-400 mb-2">12</h3>
            <h3 className="text-lg font-semibold">No of Meetings Scheduled in Month</h3>
            <p className="text-gray-400 text-sm mt-1">Upcoming sessions this month</p>
          </div>
          <div
            onClick={goToSummaries}
            className="p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.02] transition-transform border border-transparent hover:border-blue-500"
            style={{ background: "linear-gradient(to bottom right, #121e3d, #0f2a52)", minHeight: "280px" }}
          >
            <h3 className="text-5xl font-bold text-blue-400 mb-2">8</h3>
            <h3 className="text-lg font-semibold">AI Summary Reports</h3>
            <p className="text-gray-400 text-sm mt-1">Generated meeting summaries available</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-17">
          <button
            onClick={() => setOpenModal(true)}
            className="font-semibold px-6 py-3 rounded-xl shadow-lg text-white w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Create Meeting
          </button>
          <button
            onClick={join}
            className="font-semibold px-6 py-3 rounded-xl shadow-lg border border-blue-500 text-blue-400 w-full sm:w-auto"
            style={{ backgroundColor: "transparent" }}
          >
            Join Meeting
          </button>
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-600 rounded-2xl p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Create New Meeting</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Meeting Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              ></textarea>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-md text-gray-400 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={Save_Meeting_info}
                  disabled={localLoading}
                  className="px-8 py-2 rounded-md text-white"
                  style={{ background: "linear-gradient(to right, #2563eb, #3b82f6)" }}
                >
                  {localLoading ? "Starting..." : "Start"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

