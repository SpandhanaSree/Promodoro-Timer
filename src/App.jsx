import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [mode, setMode] = useState('Focus');
  const [sessions, setSessions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  console.log('App rendered:', {
  seconds,
  isRunning,
  deadline: endTimeRef.current
});

  const formattedTime =
    `${String(minutes).padStart(2, '0')}:` +
    `${String(remainingSeconds).padStart(2, '0')}`;

  useEffect(() => {
  console.log('APP MOUNTED');

  return () => {
    console.log('APP UNMOUNTED');
  };
}, []);
    useEffect(() => {
  if (isRunning) {
    document.title = `${formattedTime} | Pomodoro Timer`;
  } else {
    document.title = 'Pomodoro Timer';
  }

  return () => {
    document.title = 'Pomodoro Timer';
  };
}, [isRunning, formattedTime]);
useEffect(() => {
  if (!isRunning) return;

  if (endTimeRef.current === null) {
    endTimeRef.current = Date.now() + seconds * 1000;
  }

  const tick = () => {
    const remaining = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000)
    );

    setSeconds(remaining);

    if (remaining === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      endTimeRef.current = null;

      if (mode === 'Focus') {
        setSessions((count) => count + 1);
        setMode('Break');
        setSeconds(5 * 60);
      } else {
        setMode('Focus');
        setSeconds(25 * 60);
      }

      setIsRunning(false);
    }
  };

  intervalRef.current = setInterval(tick, 250);

  return () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
}, [isRunning, mode]); 


useEffect(() => {
  const handleVisibilityChange = () => {
    if (
      document.visibilityState === 'visible' &&
      isRunning &&
      endTimeRef.current !== null
    ) {
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );

      setSeconds(remaining);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
  };
}, [isRunning]);


return (
    <main className="timer-container">
      <h1>Pomodoro Timer</h1>
     <p className="subtitle">
  {mode === 'Focus' ? 'Focus time — stay productive!' : 'Break time — relax a little!'}
</p>

      <div className="mode-selector">
        <button
  className={`mode-button ${mode === 'Focus' ? 'active' : ''}`}
  onClick={() => {
    setIsRunning(false);
    setMode('Focus');
    setSeconds(25 * 60);
  }}
>
  Focus
</button>

        <button
          className={`mode-button ${mode === 'Break' ? 'active' : ''}`}
          onClick={() => {
  setIsRunning(false);
  setMode('Break');
  setSeconds(5 * 60);
}}
        >
          Break
        </button>
      </div>

      <div className="timer-display">{formattedTime}</div>

      <div className="timer-controls">
        <button
  className="control-button start-button"
  onClick={() => {
    endTimeRef.current = Date.now() + seconds * 1000;
    setIsRunning(true);
  }}
  disabled={isRunning}
>
  Start
</button>
        <button
  className="control-button"
  onClick={() => {
    if (endTimeRef.current !== null) {
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );

      setSeconds(remaining);
      endTimeRef.current = null;
    }

    setIsRunning(false);
  }}
  disabled={!isRunning}
>
  Pause
</button>

<button
  className="control-button reset-button"
  onClick={() => {
    console.log('RESET BUTTON CLICKED');
setIsRunning(false);
    endTimeRef.current = null;
    setSeconds(mode === 'Focus' ? 25 * 60 : 5 * 60);
  }}
>
  Reset
</button>
      </div>

      <p className="sessions">
        Completed focus sessions: <strong>{sessions}</strong>
      </p>
    </main>
  );


useEffect(() => {
  console.log('Page loaded at:', new Date().toLocaleTimeString());

  const handlePageShow = (event) => {
    console.log('Page shown:', {
      time: new Date().toLocaleTimeString(),
      restoredFromCache: event.persisted,
    });
  };

  window.addEventListener('pageshow', handlePageShow);

  return () => {
    window.removeEventListener('pageshow', handlePageShow);
  };
}, []);

}

export default App;
