// // 'use client';

// // import React from 'react';

// // interface HostPanelProps {
// //   roomName: string;
// //   onClose: () => void;
// // }

// // const CATEGORIES = [
// //   { id: 23,   name: "History" },
// //   { id: 9,    name: "General Knowledge" },
// //   { id: 18,   name: "Computers" },
// //   { id: 17,   name: "Science & Nature" },
// //   { id: 10,   name: "English" },
// // ];

// // const TIME_OPTIONS = [
// //   { value: 5,  label: "5 minutes" },
// //   { value: 10, label: "10 minutes" },
// //   { value: 15, label: "15 minutes" },
// //   { value: 20, label: "20 minutes" },
// //   { value: 30, label: "30 minutes" },
// // ];

// // const QUESTIONS_OPTIONS = [
// //   { value: 5,  label: "5 Questions" },
// //   { value: 10, label: "10 Questions" },
// //   { value: 15, label: "15 Questions" },
// //   { value: 20, label: "20 Questions" },
// // ];

// // export function HostPanel({ roomName, onClose }: HostPanelProps) {
// //   const [isMuted, setIsMuted] = React.useState(false);
// //   const [showQuizModal, setShowQuizModal] = React.useState(false);
// //   const [selectedCategory, setSelectedCategory] = React.useState('9');
// //   const [timeLimit, setTimeLimit] = React.useState(10);
// //   const [questionCount, setQuestionCount] = React.useState(10);
// //   const [quizPassword, setQuizPassword] = React.useState('');
// //   const [quizLoading, setQuizLoading] = React.useState(false);
// //   const [quizLink, setQuizLink] = React.useState('');
// //   const [quizStarted, setQuizStarted] = React.useState(false);
// //   const [showResults, setShowResults] = React.useState(false);
// //   const [results, setResults] = React.useState<any[]>([]);
// //   const [resultsLoading, setResultsLoading] = React.useState(false);
// //   const [correctAnswers, setCorrectAnswers] = React.useState<any[]>([]);
// //   const [copied, setCopied] = React.useState(false);

// //   const handleMuteAll = async () => {
// //     try {
// //       const res = await fetch('/api/meeting/mute-all', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ roomName, mute: true }),
// //       });
// //       if (res.ok) setIsMuted(true);
// //     } catch (err) {
// //       console.error('Mute error:', err);
// //     }
// //   };

// //   const handleUnmuteAll = async () => {
// //     try {
// //       const res = await fetch('/api/meeting/mute-all', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ roomName, mute: false }),
// //       });
// //       if (res.ok) setIsMuted(false);
// //     } catch (err) {
// //       console.error('Unmute error:', err);
// //     }
// //   };

// //   const handleGenerateQuiz = async () => {
// //     if (!quizPassword.trim()) {
// //       alert('Please enter a quiz password!');
// //       return;
// //     }
// //     setQuizLoading(true);
// //     try {
// //       const res = await fetch('/api/quiz/generate', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           roomName,
// //           category: selectedCategory,
// //           timeLimit: timeLimit * 60,
// //           password: quizPassword,
// //           questionCount,
// //         }),
// //       });
// //       const data = await res.json();
// //       if (data.success) {
// //         const link = `${window.location.origin}/quiz/${roomName}`;
// //         setQuizLink(link);
// //         setQuizStarted(true);
// //         setShowQuizModal(false);
// //       } else {
// //         alert('Quiz generation failed: ' + data.error);
// //       }
// //     } catch (err) {
// //       console.error('Quiz error:', err);
// //       alert('Quiz generation failed!');
// //     } finally {
// //       setQuizLoading(false);
// //     }
// //   };

// //   const handleCopyLink = () => {
// //     const fullText = `Quiz Link: ${quizLink}\nPassword: ${quizPassword}`;
// //     navigator.clipboard.writeText(fullText);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   const handleSeeResults = async () => {
// //   setResultsLoading(true);
// //   setShowResults(true);

// //   try {
// //     const res = await fetch(`/api/quiz/results?roomName=${roomName}`);
// //     const data = await res.json();

// //     if (data.success) {
// //       setResults(data.results);
// //       setCorrectAnswers(data.correctAnswers || []);
// //     }
// //   } catch (err) {
// //     console.error('Results error:', err);
// //   } finally {
// //     setResultsLoading(false);
// //   }
// // };
// //   const handleDownloadCSV = () => {
// //     if (results.length === 0) return;
// //     const headers = ['Rank', 'Name', 'Roll No', 'Category', 'Score', 'Percentage', 'Time (seconds)'];
// //     const rows = results.map(r => [
// //       r.rank, r.participantName, r.rollNumber,
// //       r.category, `="${r.scoreDisplay}"`, `${r.percentage}%`, r.timeTaken,
// //     ]);
// //     const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
// //     const blob = new Blob([csvContent], { type: 'text/csv' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `quiz-results-${roomName}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// 'use client';

// import React from 'react';

// interface HostPanelProps {
//   roomName: string;
//   onClose: () => void;
// }

// const CATEGORIES = [
//   { id: 23,   name: "History" },
//   { id: 9,    name: "General Knowledge" },
//   { id: 18,   name: "Computers" },
//   { id: 17,   name: "Science & Nature" },
//   { id: 10,   name: "English" },
// ];

// const TIME_OPTIONS = [
//   { value: 5,  label: "5 minutes" },
//   { value: 10, label: "10 minutes" },
//   { value: 15, label: "15 minutes" },
//   { value: 20, label: "20 minutes" },
//   { value: 30, label: "30 minutes" },
// ];

// const QUESTIONS_OPTIONS = [
//   { value: 5,  label: "5 Questions" },
//   { value: 10, label: "10 Questions" },
//   { value: 15, label: "15 Questions" },
//   { value: 20, label: "20 Questions" },
// ];

// export function HostPanel({ roomName, onClose }: HostPanelProps) {
//   const [isMuted, setIsMuted] = React.useState(false);
//   const [showQuizModal, setShowQuizModal] = React.useState(false);
//   const [selectedCategory, setSelectedCategory] = React.useState('9');
//   const [timeLimit, setTimeLimit] = React.useState(10);
//   const [questionCount, setQuestionCount] = React.useState(10);
//   const [quizPassword, setQuizPassword] = React.useState('');
//   const [quizLoading, setQuizLoading] = React.useState(false);
//   const [quizLink, setQuizLink] = React.useState('');
//   const [quizStarted, setQuizStarted] = React.useState(false);
//   const [showResults, setShowResults] = React.useState(false);
//   const [results, setResults] = React.useState<any[]>([]);
//   const [resultsLoading, setResultsLoading] = React.useState(false);
//   const [correctAnswers, setCorrectAnswers] = React.useState<any[]>([]);
//   const [copied, setCopied] = React.useState(false);

//   // ✅ ATTENDANCE state
//   const [attendanceLoading, setAttendanceLoading] = React.useState(false);

//   // ---- your existing functions (unchanged) ----

//   const handleMuteAll = async () => {
//     try {
//       const res = await fetch('/api/meeting/mute-all', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ roomName, mute: true }),
//       });
//       if (res.ok) setIsMuted(true);
//     } catch (err) {
//       console.error('Mute error:', err);
//     }
//   };

//   const handleUnmuteAll = async () => {
//     try {
//       const res = await fetch('/api/meeting/mute-all', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ roomName, mute: false }),
//       });
//       if (res.ok) setIsMuted(false);
//     } catch (err) {
//       console.error('Unmute error:', err);
//     }
//   };

//   const handleGenerateQuiz = async () => {
//     if (!quizPassword.trim()) {
//       alert('Please enter a quiz password!');
//       return;
//     }
//     setQuizLoading(true);
//     try {
//       const res = await fetch('/api/quiz/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           roomName,
//           category: selectedCategory,
//           timeLimit: timeLimit * 60,
//           password: quizPassword,
//           questionCount,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         const link = `${window.location.origin}/quiz/${roomName}`;
//         setQuizLink(link);
//         setQuizStarted(true);
//         setShowQuizModal(false);
//       } else {
//         alert('Quiz generation failed: ' + data.error);
//       }
//     } catch (err) {
//       console.error('Quiz error:', err);
//       alert('Quiz generation failed!');
//     } finally {
//       setQuizLoading(false);
//     }
//   };

//   const handleCopyLink = () => {
//     const fullText = `Quiz Link: ${quizLink}\nPassword: ${quizPassword}`;
//     navigator.clipboard.writeText(fullText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleSeeResults = async () => {
//     setResultsLoading(true);
//     setShowResults(true);
//     try {
//       const res = await fetch(`/api/quiz/results?roomName=${roomName}`);
//       const data = await res.json();
//       if (data.success) {
//         setResults(data.results);
//         setCorrectAnswers(data.correctAnswers || []);
//       }
//     } catch (err) {
//       console.error('Results error:', err);
//     } finally {
//       setResultsLoading(false);
//     }
//   };

//   const handleDownloadCSV = () => {
//     if (results.length === 0) return;
//     const headers = ['Rank', 'Name', 'Roll No', 'Category', 'Score', 'Percentage', 'Time (seconds)'];
//     const rows = results.map(r => [
//       r.rank, r.participantName, r.rollNumber,
//       r.category, `="${r.scoreDisplay}"`, `${r.percentage}%`, r.timeTaken,
//     ]);
//     const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `quiz-results-${roomName}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ✅ ATTENDANCE — generate and download PDF report
//   const handleGenerateAttendance = async () => {
//     setAttendanceLoading(true);
//     try {
//       // 1. Fetch attendance data from your API
//       const res = await fetch(`/api/attendance/report?roomName=${roomName}`);
//       const data = await res.json();

//       if (!data.success) {
//         alert('Failed to fetch attendance: ' + (data.error || 'Unknown error'));
//         return;
//       }

//       const { meetingTitle, requiredDuration, date, records } = data;

//       // 2. Build PDF using plain HTML → print trick (no extra library needed)
//       //    This opens a small popup, user clicks Print → Save as PDF
//       const printWindow = window.open('', '_blank', 'width=800,height=600');
//       if (!printWindow) {
//         alert('Please allow popups for this site to download the PDF.');
//         return;
//       }

//       const rows = records.map((r: any, i: number) => `
//         <tr>
//           <td>${i + 1}</td>
//           <td>${r.userName}</td>
//           <td>${r.duration ?? 0} min</td>
//           <td style="color: ${r.status === 'present' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
//             ${r.status.toUpperCase()}
//           </td>
//         </tr>
//       `).join('');

//       const presentCount = records.filter((r: any) => r.status === 'present').length;
//       const absentCount  = records.filter((r: any) => r.status === 'absent').length;

//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Attendance Report — ${meetingTitle}</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
//             h1 { color: #1a1a2e; margin-bottom: 4px; }
//             .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
//             .summary { display: flex; gap: 20px; margin-bottom: 24px; }
//             .summary-box { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: bold; }
//             .present-box { background: #d5f5e3; color: #27ae60; }
//             .absent-box  { background: #fde8e8; color: #e74c3c; }
//             table { width: 100%; border-collapse: collapse; }
//             th { background: #1a1a2e; color: white; padding: 10px 14px; text-align: left; font-size: 13px; }
//             td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
//             tr:nth-child(even) td { background: #f9f9f9; }
//             @media print {
//               button { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <h1>📋 Attendance Report</h1>
//           <div class="meta">
//             <strong>Meeting:</strong> ${meetingTitle} &nbsp;|&nbsp;
//             <strong>Date:</strong> ${date} &nbsp;|&nbsp;
//             <strong>Required Duration:</strong> ${requiredDuration} minutes
//           </div>
//           <div class="summary">
//             <div class="summary-box present-box">✅ Present: ${presentCount}</div>
//             <div class="summary-box absent-box">❌ Absent: ${absentCount}</div>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Student Name</th>
//                 <th>Time Stayed</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows || '<tr><td colspan="4" style="text-align:center;color:#999;">No attendance records yet</td></tr>'}
//             </tbody>
//           </table>
//           <br/>
//           <button onclick="window.print()" style="
//             background:#1a1a2e; color:white; border:none;
//             padding:10px 24px; border-radius:8px;
//             font-size:14px; cursor:pointer;
//           ">
//             🖨️ Print / Save as PDF
//           </button>
//         </body>
//         </html>
//       `);
//       printWindow.document.close();

//     } catch (err) {
//       console.error('Attendance report error:', err);
//       alert('Failed to generate attendance report!');
//     } finally {
//       setAttendanceLoading(false);
//     }
//   };


//   return (
//     <>
//       {/* Main Panel */}
//       <div style={{
//         position: 'fixed', bottom: '70px', right: '14px',
//         zIndex: 99999, backgroundColor: '#1a1a2e',
//         border: '1px solid rgba(74,144,217,0.4)',
//         borderRadius: '12px', padding: '14px',
//         minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
//       }}>
//         <div style={{
//           display: 'flex', justifyContent: 'space-between',
//           alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
//           paddingBottom: '8px', marginBottom: '10px',
//         }}>
//           <span style={{ color: '#4a90d9', fontWeight: 'bold', fontSize: '13px' }}>
//             Host Controls
//           </span>
//           <button onClick={onClose} style={{
//             background: 'none', border: 'none',
//             color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '16px',
//           }}>X</button>
//         </div>

//         <button onClick={handleMuteAll} disabled={isMuted} style={{
//           width: '100%', backgroundColor: isMuted ? '#444' : '#e74c3c',
//           color: 'white', border: 'none', borderRadius: '8px',
//           padding: '9px 12px', cursor: isMuted ? 'not-allowed' : 'pointer',
//           fontSize: '13px', marginBottom: '8px', textAlign: 'left',
//         }}>
//           Mute All
//         </button>

//         <button onClick={handleUnmuteAll} disabled={!isMuted} style={{
//           width: '100%', backgroundColor: !isMuted ? '#444' : '#2ecc71',
//           color: 'white', border: 'none', borderRadius: '8px',
//           padding: '9px 12px', cursor: !isMuted ? 'not-allowed' : 'pointer',
//           fontSize: '13px', marginBottom: '8px', textAlign: 'left',
//         }}>
//           Unmute All
//         </button>

//         <button onClick={handleGenerateAttendance} disabled={attendanceLoading} style={{
//           width: '100%', backgroundColor: attendanceLoading ? '#444' : '#4a90d9',
//           color: 'white', border: 'none', borderRadius: '8px',
//           padding: '9px 12px', cursor: attendanceLoading ? 'not-allowed' : 'pointer',
//           fontSize: '13px', marginBottom: '8px', textAlign: 'left',
//         }}>
//           Generate Attendence 
//         </button>

//         <button onClick={() => setShowQuizModal(true)} style={{
//           width: '100%', backgroundColor: quizStarted ? '#27ae60' : '#f39c12',
//           color: 'white', border: 'none', borderRadius: '8px',
//           padding: '9px 12px', cursor: 'pointer',
//           fontSize: '13px', marginBottom: '8px', textAlign: 'left',
//         }}>
//           {quizStarted ? 'Quiz Active' : 'Introduce Quiz'}
//         </button>

//         {quizLink && (
//           <div style={{
//             backgroundColor: 'rgba(74,144,217,0.1)',
//             border: '1px solid rgba(74,144,217,0.3)',
//             borderRadius: '8px', padding: '8px', marginBottom: '8px',
//           }}>
//             <p style={{ color: '#4a90d9', fontSize: '11px', margin: '0 0 4px' }}>Quiz Link:</p>
//             <p style={{ color: 'white', fontSize: '11px', margin: '0 0 4px', wordBreak: 'break-all' }}>{quizLink}</p>
//             <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 6px' }}>
//               Password: <strong style={{ color: 'white' }}>{quizPassword}</strong>
//             </p>
//             <button onClick={handleCopyLink} style={{
//               width: '100%', backgroundColor: copied ? '#27ae60' : '#4a90d9',
//               color: 'white', border: 'none', borderRadius: '6px',
//               padding: '6px', cursor: 'pointer', fontSize: '12px',
//             }}>
//               {copied ? 'Copied!' : 'Copy Link + Password'}
//             </button>
//           </div>
//         )}

//         <button onClick={handleSeeResults} style={{
//           width: '100%', backgroundColor: '#9b59b6',
//           color: 'white', border: 'none', borderRadius: '8px',
//           padding: '9px 12px', cursor: 'pointer',
//           fontSize: '13px', textAlign: 'left',
//         }}>
//           See Results
//         </button>
//       </div>

//       {/* Quiz Modal */}
//       {showQuizModal && (
//         <div style={{
//           position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
//           zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <div style={{
//             backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
//             borderRadius: '16px', padding: '28px', width: '380px',
//           }}>
//             <h3 style={{ color: '#4a90d9', marginTop: 0, marginBottom: '20px' }}>Create Quiz</h3>

//             <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Category:</label>
//             <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
//               aria-label="Quiz Category"
//               style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
//               {CATEGORIES.map(cat => (
//                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//               ))}
//             </select>

//             <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Number of Questions:</label>
//             <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}
//               aria-label="Question Count"
//               style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
//               {QUESTIONS_OPTIONS.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>

//             <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Time Limit:</label>
//             <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}
//               aria-label="Time Limit"
//               style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
//               {TIME_OPTIONS.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>

//             <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Password:</label>
//             <input type="text" placeholder="Enter quiz password..." value={quizPassword}
//               onChange={(e) => setQuizPassword(e.target.value)}
//               style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
//             />

//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button onClick={() => setShowQuizModal(false)} style={{
//                 flex: 1, padding: '10px', borderRadius: '8px',
//                 border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
//                 color: 'white', cursor: 'pointer', fontSize: '14px',
//               }}>Cancel</button>
//               <button onClick={handleGenerateQuiz} disabled={quizLoading} style={{
//                 flex: 1, padding: '10px', borderRadius: '8px',
//                 border: 'none', background: '#4a90d9',
//                 color: 'white', cursor: quizLoading ? 'not-allowed' : 'pointer',
//                 fontSize: '14px', fontWeight: 'bold',
//               }}>
//                 {quizLoading ? 'Generating...' : 'Generate Quiz'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Results Modal */}
//       {showResults && (
//         <div style={{
//           position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
//           zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <div style={{
//             backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
//             borderRadius: '16px', padding: '28px',
//             width: '650px', maxHeight: '85vh', overflowY: 'auto',
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ color: '#4a90d9', margin: 0 }}>Quiz Results</h3>
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 {results.length > 0 && (
//                   <button onClick={handleDownloadCSV} style={{
//                     backgroundColor: '#27ae60', color: 'white',
//                     border: 'none', borderRadius: '8px',
//                     padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
//                   }}>
//                     Download CSV
//                   </button>
//                 )}
//                 <button onClick={() => setShowResults(false)} style={{
//                   background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px',
//                 }}>X</button>
//               </div>
//             </div>

//             {results.length > 0 && (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
//                 <div style={{ backgroundColor: 'rgba(74,144,217,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(74,144,217,0.2)' }}>
//                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90d9' }}>{results.length}</div>
//                   <div style={{ fontSize: '11px', color: '#aaa' }}>Total Attempts</div>
//                 </div>
//                 <div style={{ backgroundColor: 'rgba(46,204,113,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(46,204,113,0.2)' }}>
//                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{results[0]?.scoreDisplay}</div>
//                   <div style={{ fontSize: '11px', color: '#aaa' }}>Top Score</div>
//                 </div>
//                 <div style={{ backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(243,156,18,0.2)' }}>
//                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
//                     {Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%
//                   </div>
//                   <div style={{ fontSize: '11px', color: '#aaa' }}>Avg Score</div>
//                 </div>
//               </div>
//             )}

//             {resultsLoading ? (
//               <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
//             ) : results.length === 0 ? (
//               <p style={{ color: '#aaa', textAlign: 'center' }}>No results yet.</p>
//             ) : (
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr style={{ borderBottom: '2px solid rgba(74,144,217,0.4)' }}>
//                     {['Rank', 'Name', 'Roll No', 'Score', '%', 'Time'].map(h => (
//                       <th key={h} style={{ color: '#4a90d9', padding: '10px 8px', textAlign: 'left', fontSize: '12px' }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {results.map((r, i) => (
//                     <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i === 0 ? 'rgba(46,204,113,0.08)' : 'transparent' }}>
//                       <td style={{ padding: '10px 8px', fontSize: '16px' }}>
//                         {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${r.rank}`}
//                       </td>
//                       <td style={{ padding: '10px 8px', color: 'white', fontSize: '13px' }}>{r.participantName}</td>
//                       <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.rollNumber}</td>
//                       <td style={{ padding: '10px 8px', color: '#2ecc71', fontWeight: 'bold', fontSize: '13px' }}>{r.scoreDisplay}</td>
//                       <td style={{ padding: '10px 8px', fontSize: '13px', color: r.percentage >= 80 ? '#2ecc71' : r.percentage >= 50 ? '#f39c12' : '#e74c3c' }}>{r.percentage}%</td>
//                       <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.timeTaken}s</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               )}

//               {/* Correct Answers Section */}
//               {correctAnswers && correctAnswers.length > 0 && (
//                 <div style={{ marginTop: '20px' }}>
//                   <h4 style={{ color: '#4a90d9', marginBottom: '12px' }}>Answer Key</h4>
//                   {correctAnswers.map((item: any, i: number) => (
//                     <div key={i} style={{
//                       backgroundColor: 'rgba(46,204,113,0.08)',
//                       border: '1px solid rgba(46,204,113,0.2)',
//                       borderRadius: '8px', padding: '10px 14px',
//                       marginBottom: '8px',
//                     }}>
//                       <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px' }}>
//                         Q{item.questionNo}:
//                         <span dangerouslySetInnerHTML={{ __html: ' ' + item.question }}></span>
//                       </p>
//                       <p style={{ color: '#2ecc71', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
//                         Correct: <span dangerouslySetInnerHTML={{ __html: item.correctAnswer }}></span>
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
            
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import React from 'react';

interface HostPanelProps {
  roomName: string;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 23,   name: "History" },
  { id: 9,    name: "General Knowledge" },
  { id: 18,   name: "Computers" },
  { id: 17,   name: "Science & Nature" },
  { id: 10,   name: "English" },
];

const TIME_OPTIONS = [
  { value: 5,  label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
];

const QUESTIONS_OPTIONS = [
  { value: 5,  label: "5 Questions" },
  { value: 10, label: "10 Questions" },
  { value: 15, label: "15 Questions" },
  { value: 20, label: "20 Questions" },
];

export function HostPanel({ roomName, onClose }: HostPanelProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [showQuizModal, setShowQuizModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('9');
  const [timeLimit, setTimeLimit] = React.useState(10);
  const [questionCount, setQuestionCount] = React.useState(10);
  const [quizPassword, setQuizPassword] = React.useState('');
  const [quizLoading, setQuizLoading] = React.useState(false);
  const [quizLink, setQuizLink] = React.useState('');
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState<any[]>([]);
  const [copied, setCopied] = React.useState(false);

  // ✅ ATTENDANCE STATE
  const [showAttendanceModal, setShowAttendanceModal] = React.useState(false);
  const [requiredMinutes, setRequiredMinutes] = React.useState('');
  const [attendanceLoading, setAttendanceLoading] = React.useState(false);

  // ---- existing quiz functions (unchanged) ----

  const handleMuteAll = async () => {
    try {
      const res = await fetch('/api/meeting/mute-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, mute: true }),
      });
      if (res.ok) setIsMuted(true);
    } catch (err) {
      console.error('Mute error:', err);
    }
  };

  const handleUnmuteAll = async () => {
    try {
      const res = await fetch('/api/meeting/mute-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, mute: false }),
      });
      if (res.ok) setIsMuted(false);
    } catch (err) {
      console.error('Unmute error:', err);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizPassword.trim()) {
      alert('Please enter a quiz password!');
      return;
    }
    setQuizLoading(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          category: selectedCategory,
          timeLimit: timeLimit * 60,
          password: quizPassword,
          questionCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const link = `${window.location.origin}/quiz/${roomName}`;
        setQuizLink(link);
        setQuizStarted(true);
        setShowQuizModal(false);
      } else {
        alert('Quiz generation failed: ' + data.error);
      }
    } catch (err) {
      console.error('Quiz error:', err);
      alert('Quiz generation failed!');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCopyLink = () => {
    const fullText = `Quiz Link: ${quizLink}\nPassword: ${quizPassword}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeeResults = async () => {
    setResultsLoading(true);
    setShowResults(true);
    try {
      const res = await fetch(`/api/quiz/results?roomName=${roomName}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setCorrectAnswers(data.correctAnswers || []);
      }
    } catch (err) {
      console.error('Results error:', err);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) return;
    const headers = ['Rank', 'Name', 'Roll No', 'Category', 'Score', 'Percentage', 'Time (seconds)'];
    const rows = results.map((r: any) => [
      r.rank, r.participantName, r.rollNumber,
      r.category, `="${r.scoreDisplay}"`, `${r.percentage}%`, r.timeTaken,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${roomName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ ATTENDANCE — opens modal where host enters required minutes
  const handleGenerateAttendance = () => {
    setRequiredMinutes('');
    setShowAttendanceModal(true);
  };

  // ✅ ATTENDANCE — fetch report with host-specified required minutes, then render PDF
  const handleGenerateNow = async () => {
    const mins = parseInt(requiredMinutes, 10);
    if (isNaN(mins) || mins < 0) {
      alert('Please enter a valid number of minutes (0 or more).');
      return;
    }

    setAttendanceLoading(true);
    try {
      const res = await fetch(
        `/api/attendance/report?roomName=${encodeURIComponent(roomName)}&requiredMinutes=${mins}`
      );
      const data = await res.json();

      if (!data.success) {
        alert('Failed to fetch attendance: ' + (data.error || 'Unknown error'));
        return;
      }

      const { meetingTitle, requiredDuration, date, records } = data;

      const presentCount = records.filter((r: any) => r.status === 'present').length;
      const absentCount  = records.filter((r: any) => r.status === 'absent').length;
      const total        = records.length;

      // Build nicely styled PDF content
      const rows = records.map((r: any, i: number) => `
        <tr class="${r.status === 'present' ? 'row-present' : 'row-absent'}">
          <td class="cell-num">${i + 1}</td>
          <td class="cell-name">${escapeHtml(r.userName)}</td>
          <td class="cell-time">${r.duration ?? 0} min</td>
          <td class="cell-status ${r.status === 'present' ? 'status-present' : 'status-absent'}">
            ${r.status === 'present' ? '✅ PRESENT' : '❌ ABSENT'}
          </td>
        </tr>
      `).join('');

      const presentPct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        alert('Please allow popups for this site to download the PDF.');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Attendance Report — ${escapeHtml(meetingTitle)}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f4f6fb;
              color: #222;
              padding: 0;
            }

            /* ── Header Banner ── */
            .header {
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
              color: white;
              padding: 32px 40px 24px;
              display: flex;
              align-items: center;
              gap: 18px;
            }
            .header-icon { font-size: 48px; }
            .header-text h1 { font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
            .header-text p  { font-size: 13px; color: rgba(255,255,255,0.65); margin-top: 4px; }

            /* ── Meta Row ── */
            .meta-bar {
              background: #fff;
              border-bottom: 1px solid #e0e6ef;
              padding: 14px 40px;
              display: flex;
              gap: 32px;
              font-size: 13px;
              color: #444;
              flex-wrap: wrap;
            }
            .meta-bar strong { color: #1a1a2e; }

            /* ── Summary Cards ── */
            .summary {
              display: flex;
              gap: 16px;
              padding: 24px 40px 0;
            }
            .card {
              flex: 1;
              border-radius: 12px;
              padding: 18px 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
            }
            .card-total   { background: #e8eeff; border: 1px solid #c5d0f5; }
            .card-present { background: #d5f5e3; border: 1px solid #a8e6c3; }
            .card-absent  { background: #fde8e8; border: 1px solid #f5b8b8; }
            .card-pct     { background: #fff8e1; border: 1px solid #ffe082; }
            .card .num   { font-size: 32px; font-weight: 800; }
            .card .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .card-total   .num { color: #3a4fc4; }
            .card-present .num { color: #27ae60; }
            .card-absent  .num { color: #e74c3c; }
            .card-pct     .num { color: #f39c12; }

            /* ── Table ── */
            .table-wrap { padding: 24px 40px 40px; }
            table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
            thead tr { background: #1a1a2e; }
            th { color: white; padding: 13px 16px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; }
            td { padding: 12px 16px; font-size: 13px; }
            .cell-num  { color: #888; width: 50px; }
            .cell-name { font-weight: 500; color: #1a1a2e; }
            .cell-time { color: #555; }
            .status-present { color: #27ae60; font-weight: 700; }
            .status-absent  { color: #e74c3c; font-weight: 700; }
            .row-present td { background: rgba(39,174,96,0.04); }
            .row-absent  td { background: #fff; }
            tbody tr:not(:last-child) td { border-bottom: 1px solid #f0f0f0; }
            tbody tr:hover td { background: #f7f9ff; }

            /* ── Footer ── */
            .footer {
              text-align: center;
              color: #aaa;
              font-size: 11px;
              padding: 0 40px 30px;
            }

            /* ── Print Button (hidden when printing) ── */
            .print-btn {
              display: block;
              margin: 0 40px 30px;
              background: linear-gradient(135deg, #1a1a2e, #0f3460);
              color: white;
              border: none;
              padding: 13px 28px;
              border-radius: 8px;
              font-size: 15px;
              cursor: pointer;
              font-weight: 600;
              letter-spacing: 0.3px;
              width: calc(100% - 80px);
            }

            @media print {
              body { background: white; }
              .print-btn { display: none; }
              .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .card   { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>

          <div class="header">
            <div class="header-icon">📋</div>
            <div class="header-text">
              <h1>Attendance Report</h1>
              <p>Generated on ${new Date().toLocaleString('en-PK')}</p>
            </div>
          </div>

          <div class="meta-bar">
            <span>📌 <strong>Meeting:</strong> ${escapeHtml(meetingTitle)}</span>
            <span>📅 <strong>Date:</strong> ${date}</span>
            <span>⏱️ <strong>Required Duration:</strong> ${requiredDuration} minutes</span>
          </div>

          <div class="summary">
            <div class="card card-total">
              <span class="num">${total}</span>
              <span class="label">Total</span>
            </div>
            <div class="card card-present">
              <span class="num">${presentCount}</span>
              <span class="label">Present</span>
            </div>
            <div class="card card-absent">
              <span class="num">${absentCount}</span>
              <span class="label">Absent</span>
            </div>
            <div class="card card-pct">
              <span class="num">${presentPct}%</span>
              <span class="label">Attendance</span>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Time Stayed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${records.length > 0 ? rows : `
                  <tr><td colspan="4" style="text-align:center;color:#999;padding:24px;">
                    No attendance records found for this meeting.
                  </td></tr>
                `}
              </tbody>
            </table>
          </div>

          <button class="print-btn" onclick="window.print()">
            🖨️ Print / Save as PDF
          </button>

          <div class="footer">
            HoloMeet Attendance System &nbsp;•&nbsp; This report is confidential and for the host only.
          </div>

        </body>
        </html>
      `);
      printWindow.document.close();

      setShowAttendanceModal(false);
    } catch (err) {
      console.error('Attendance report error:', err);
      alert('Failed to generate attendance report!');
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Helper to escape HTML special chars in names
  function escapeHtml(text: string) {
    return (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─────────────────────────── RENDER ───────────────────────────

  return (
    <>
      {/* ── Main Panel ── */}
      <div style={{
        position: 'fixed', bottom: '70px', right: '14px',
        zIndex: 99999, backgroundColor: '#1a1a2e',
        border: '1px solid rgba(74,144,217,0.4)',
        borderRadius: '12px', padding: '14px',
        minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '8px', marginBottom: '10px',
        }}>
          <span style={{ color: '#4a90d9', fontWeight: 'bold', fontSize: '13px' }}>
            Host Controls
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        <button onClick={handleMuteAll} disabled={isMuted} style={{
          width: '100%', backgroundColor: isMuted ? '#444' : '#e74c3c',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: isMuted ? 'not-allowed' : 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          🔇 Mute All
        </button>

        <button onClick={handleUnmuteAll} disabled={!isMuted} style={{
          width: '100%', backgroundColor: !isMuted ? '#444' : '#2ecc71',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: !isMuted ? 'not-allowed' : 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          🔊 Unmute All
        </button>

        {/* ✅ ATTENDANCE BUTTON */}
        <button onClick={handleGenerateAttendance} style={{
          width: '100%', backgroundColor: '#4a90d9',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          📋 Generate Attendance
        </button>

        <button onClick={() => setShowQuizModal(true)} style={{
          width: '100%', backgroundColor: quizStarted ? '#27ae60' : '#f39c12',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          {quizStarted ? '✅ Quiz Active' : '📝 Introduce Quiz'}
        </button>

        {quizLink && (
          <div style={{
            backgroundColor: 'rgba(74,144,217,0.1)',
            border: '1px solid rgba(74,144,217,0.3)',
            borderRadius: '8px', padding: '8px', marginBottom: '8px',
          }}>
            <p style={{ color: '#4a90d9', fontSize: '11px', margin: '0 0 4px' }}>Quiz Link:</p>
            <p style={{ color: 'white', fontSize: '11px', margin: '0 0 4px', wordBreak: 'break-all' }}>{quizLink}</p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 6px' }}>
              Password: <strong style={{ color: 'white' }}>{quizPassword}</strong>
            </p>
            <button onClick={handleCopyLink} style={{
              width: '100%', backgroundColor: copied ? '#27ae60' : '#4a90d9',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px', cursor: 'pointer', fontSize: '12px',
            }}>
              {copied ? '✅ Copied!' : 'Copy Link + Password'}
            </button>
          </div>
        )}

        <button onClick={handleSeeResults} style={{
          width: '100%', backgroundColor: '#9b59b6',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: 'pointer',
          fontSize: '13px', textAlign: 'left',
        }}>
          📊 See Results
        </button>
      </div>

      {/* ✅ ATTENDANCE MODAL */}
      {showAttendanceModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(74,144,217,0.4)',
            borderRadius: '16px', padding: '32px',
            width: '380px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#4a90d9', margin: 0, fontSize: '18px' }}>📋 Generate Attendance</h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '20px' }}
              >✕</button>
            </div>

            <p style={{ color: '#bbb', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
              Enter the <strong style={{ color: 'white' }}>minimum minutes</strong> a student must stay to be marked <strong style={{ color: '#2ecc71' }}>Present</strong>.
            </p>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Required Minutes to Mark Present
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={requiredMinutes}
              onChange={(e) => setRequiredMinutes(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateNow(); }}
              style={{
                width: '100%', padding: '12px 14px',
                borderRadius: '8px', backgroundColor: '#0f0f1a',
                color: 'white', border: '1px solid rgba(74,144,217,0.5)',
                fontSize: '16px', marginBottom: '8px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <p style={{ color: '#666', fontSize: '11px', marginBottom: '20px' }}>
              Students with ≥ {requiredMinutes || '?'} minutes will be marked Present, others Absent.
            </p>

            {/* Generate Now button */}
            <button
              onClick={handleGenerateNow}
              disabled={attendanceLoading || requiredMinutes === ''}
              style={{
                width: '100%', padding: '13px',
                borderRadius: '8px', border: 'none',
                background: attendanceLoading || requiredMinutes === ''
                  ? '#444'
                  : 'linear-gradient(135deg, #4a90d9, #357abd)',
                color: 'white',
                cursor: attendanceLoading || requiredMinutes === '' ? 'not-allowed' : 'pointer',
                fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.3px',
              }}
            >
              {attendanceLoading ? '⏳ Generating...' : '🚀 Generate Now'}
            </button>
          </div>
        </div>
      )}

      {/* ── Quiz Modal ── */}
      {showQuizModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
            borderRadius: '16px', padding: '28px', width: '380px',
          }}>
            <h3 style={{ color: '#4a90d9', marginTop: 0, marginBottom: '20px' }}>Create Quiz</h3>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Category:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Quiz Category"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Number of Questions:</label>
            <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}
              aria-label="Question Count"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {QUESTIONS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Time Limit:</label>
            <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}
              aria-label="Time Limit"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {TIME_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Password:</label>
            <input type="text" placeholder="Enter quiz password..." value={quizPassword}
              onChange={(e) => setQuizPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowQuizModal(false)} style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                color: 'white', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
              <button onClick={handleGenerateQuiz} disabled={quizLoading} style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: 'none', background: '#4a90d9',
                color: 'white', cursor: quizLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: 'bold',
              }}>
                {quizLoading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Results Modal ── */}
      {showResults && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
            borderRadius: '16px', padding: '28px',
            width: '650px', maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#4a90d9', margin: 0 }}>Quiz Results</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {results.length > 0 && (
                  <button onClick={handleDownloadCSV} style={{
                    backgroundColor: '#27ae60', color: 'white',
                    border: 'none', borderRadius: '8px',
                    padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
                  }}>
                    Download CSV
                  </button>
                )}
                <button onClick={() => setShowResults(false)} style={{
                  background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px',
                }}>✕</button>
              </div>
            </div>

            {results.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'rgba(74,144,217,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(74,144,217,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90d9' }}>{results.length}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Total Attempts</div>
                </div>
                <div style={{ backgroundColor: 'rgba(46,204,113,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(46,204,113,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{results[0]?.scoreDisplay}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Top Score</div>
                </div>
                <div style={{ backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(243,156,18,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                    {Math.round(results.reduce((a: number, r: any) => a + r.percentage, 0) / results.length)}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Avg Score</div>
                </div>
              </div>
            )}

            {resultsLoading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
            ) : results.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>No results yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(74,144,217,0.4)' }}>
                    {['Rank', 'Name', 'Roll No', 'Score', '%', 'Time'].map(h => (
                      <th key={h} style={{ color: '#4a90d9', padding: '10px 8px', textAlign: 'left', fontSize: '12px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i === 0 ? 'rgba(46,204,113,0.08)' : 'transparent' }}>
                      <td style={{ padding: '10px 8px', fontSize: '16px' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${r.rank}`}
                      </td>
                      <td style={{ padding: '10px 8px', color: 'white', fontSize: '13px' }}>{r.participantName}</td>
                      <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.rollNumber}</td>
                      <td style={{ padding: '10px 8px', color: '#2ecc71', fontWeight: 'bold', fontSize: '13px' }}>{r.scoreDisplay}</td>
                      <td style={{ padding: '10px 8px', fontSize: '13px', color: r.percentage >= 80 ? '#2ecc71' : r.percentage >= 50 ? '#f39c12' : '#e74c3c' }}>{r.percentage}%</td>
                      <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.timeTaken}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {correctAnswers && correctAnswers.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#4a90d9', marginBottom: '12px' }}>Answer Key</h4>
                {correctAnswers.map((item: any, i: number) => (
                  <div key={i} style={{
                    backgroundColor: 'rgba(46,204,113,0.08)',
                    border: '1px solid rgba(46,204,113,0.2)',
                    borderRadius: '8px', padding: '10px 14px', marginBottom: '8px',
                  }}>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px' }}>
                      Q{item.questionNo}:
                      <span dangerouslySetInnerHTML={{ __html: ' ' + item.question }}></span>
                    </p>
                    <p style={{ color: '#2ecc71', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                      Correct: <span dangerouslySetInnerHTML={{ __html: item.correctAnswer }}></span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}