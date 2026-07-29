'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;

  const [step, setStep] = React.useState<'entry' | 'quiz' | 'result'>('entry');
  const [participantName, setParticipantName] = React.useState('');
  const [rollNumber, setRollNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [entryError, setEntryError] = React.useState('');
  const [entryLoading, setEntryLoading] = React.useState(false);

  const [quiz, setQuiz] = React.useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [shuffledOptions, setShuffledOptions] = React.useState<string[][]>([]);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const startTimeRef = React.useRef<number>(0);

  const handleEntry = async () => {
    if (!participantName.trim()) { setEntryError('Please enter your name!'); return; }
    if (!rollNumber.trim()) { setEntryError('Please enter your roll number!'); return; }
    if (!password.trim()) { setEntryError('Please enter quiz password!'); return; }

    setEntryLoading(true);
    setEntryError('');

    try {
      const verifyRes = await fetch('/api/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: meetingId, password }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setEntryError('Wrong password! Please try again.');
        setEntryLoading(false);
        return;
      }

      const quizRes = await fetch(`/api/quiz/get?roomName=${meetingId}`);
      const quizData = await quizRes.json();

      if (!quizData.quiz) {
        setEntryError('No active quiz found!');
        setEntryLoading(false);
        return;
      }

      setQuiz(quizData.quiz);
      setTimeLeft(quizData.quiz.timeLimit || 60);

      const shuffled = quizData.quiz.questions.map((q: any) => {
        const opts = [...q.incorrect_answers, q.correct_answer];
        return opts.sort(() => Math.random() - 0.5);
      });
      setShuffledOptions(shuffled);
      startTimeRef.current = Date.now();
      setStep('quiz');

    } catch {
      setEntryError('Something went wrong!');
    } finally {
      setEntryLoading(false);
    }
  };

  React.useEffect(() => {
    if (step !== 'quiz' || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz._id,
          roomName: meetingId,
          answers,
          participantName,
          rollNumber,
          timeTaken,
        }),
      });
      const data = await res.json();
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const timerColor = timeLeft > 60 ? '#2ecc71' : timeLeft > 30 ? '#f39c12' : '#e74c3c';
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (step === 'entry') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0a0f2c, #081a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.3)', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#4a90d9', textAlign: 'center', marginTop: 0, marginBottom: '6px' }}>Quiz</h2>
        <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>Enter your details to start</p>

        {entryError && (
          <div style={{ backgroundColor: 'rgba(231,76,60,0.2)', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px', color: '#e74c3c', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {entryError}
          </div>
        )}

        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Full Name *</label>
        <input type="text" placeholder="Enter your full name" value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.3)', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box' }}
        />

        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Roll Number *</label>
        <input type="text" placeholder="Enter your roll number" value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.3)', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box' }}
        />

        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Password *</label>
        <input type="password" placeholder="Enter quiz password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.3)', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
        />

        <button onClick={handleEntry} disabled={entryLoading}
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#4a90d9', color: 'white', cursor: entryLoading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {entryLoading ? 'Verifying...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );

  if (step === 'result' && result) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0a0f2c, #081a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px' }}>
      <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid rgba(74,144,217,0.3)', maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
        <h2 style={{ color: '#4a90d9', marginBottom: '8px' }}>Quiz Completed!</h2>
        <p style={{ color: '#aaa', marginBottom: '6px', fontSize: '14px' }}>{participantName} | Roll: {rollNumber}</p>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2ecc71', margin: '16px 0 8px' }}>
          {result.score}/{result.totalQuestions}
        </div>
        <p style={{ color: '#aaa', marginBottom: '8px' }}>{Math.round((result.score / result.totalQuestions) * 100)}% Correct</p>
        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '24px' }}>Time: {result.timeTaken}s</p>
        <button onClick={() => router.push(`/rooms/${meetingId}`)}
          style={{ background: '#4a90d9', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px' }}
        >
          Back to Meeting
        </button>
      </div>
    </div>
  );

  if (!quiz) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#0a0f2c', color: 'white' }}>
      <p>Loading Quiz...</p>
    </div>
  );

  const question = quiz.questions[currentQuestion];
  const options = shuffledOptions[currentQuestion] || [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0a0f2c, #081a3a)', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p style={{ margin: 0, color: '#4a90d9', fontWeight: 'bold', fontSize: '16px' }}>Quiz</p>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{participantName} | Roll: {rollNumber}</p>
        </div>
        <div style={{ background: timerColor, borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold', fontSize: '20px' }}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '700px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px' }}>
          <div style={{ background: '#4a90d9', height: '100%', borderRadius: '4px', width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

            {/* Question heading with number */}
      <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '700px', border: '1px solid rgba(74,144,217,0.2)', marginBottom: '20px' }}>
        <p style={{ color: '#4a90d9', fontSize: '13px', marginBottom: '8px', margin: '0 0 8px 0' }}>
          Question {currentQuestion + 1}
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}
          dangerouslySetInnerHTML={{ __html: question.question }}
        ></p>
      </div>

      {/* Options with A,B,C,D */}
      <div style={{ width: '100%', maxWidth: '700px', marginBottom: '24px' }}>
        {options.map((option: string, i: number) => (
          <button key={i} onClick={() => setAnswers({ ...answers, [currentQuestion]: option })}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              width: '100%', textAlign: 'left',
              padding: '14px 18px', marginBottom: '10px', borderRadius: '10px',
              border: answers[currentQuestion] === option ? '2px solid #4a90d9' : '1px solid rgba(255,255,255,0.15)',
              background: answers[currentQuestion] === option ? 'rgba(74,144,217,0.2)' : 'rgba(255,255,255,0.05)',
              color: 'white', cursor: 'pointer', fontSize: '14px',
            }}
          >
            {/* A, B, C, D label */}
            <span style={{
              minWidth: '28px', height: '28px',
              backgroundColor: answers[currentQuestion] === option ? '#4a90d9' : 'rgba(255,255,255,0.1)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '13px', fontWeight: 'bold',
              flexShrink: 0,
            }}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <span dangerouslySetInnerHTML={{ __html: option }}></span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '700px' }}>
        <button onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))} disabled={currentQuestion === 0}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: currentQuestion === 0 ? '#555' : 'white', cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', fontSize: '14px' }}
        >
          Previous
        </button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrentQuestion(prev => prev + 1)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#4a90d9', color: 'white', cursor: 'pointer', fontSize: '14px' }}
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2ecc71', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}