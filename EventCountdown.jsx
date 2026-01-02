import React, { useEffect, useState } from "react";
import "./EventCountdown.css";

const EventCountdown = () => {
  const [inputEventName, setInputEventName] = useState("");
  const [inputEventDate, setInputEventDate] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  /* -------- Restore from localStorage -------- */
  useEffect(() => {
    const savedName = localStorage.getItem("eventName");
    const savedDate = localStorage.getItem("eventDate");
    const savedStart = localStorage.getItem("startTime");

    if (savedName && savedDate && savedStart) {
      setInputEventName(savedName);
      setInputEventDate(savedDate);
      setStartTime(Number(savedStart));
      setIsRunning(true);
    }
  }, []);

  /* -------- Input Handling -------- */
  const handleEventNameChange = (e) => {
    const value = e.target.value;
    setInputEventName(value);
    if (!value.trim()) setError("Event name is required");
    else setError("");
  };

  /* -------- Start Countdown -------- */
  const startCountdown = () => {
    const eventTime = new Date(inputEventDate).getTime();
    const now = Date.now();

    if (!inputEventName.trim()) {
      setError("Event name is required");
      return;
    }

    if (!inputEventDate) {
      setError("Event date is required");
      return;
    }

    if (eventTime <= now) {
      setError("Please select a future date");
      return;
    }

    setError("");
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setShowCelebration(false); // Reset celebration

    localStorage.setItem("eventName", inputEventName);
    localStorage.setItem("eventDate", inputEventDate);
    localStorage.setItem("startTime", now);
  };

  /* -------- Countdown + Progress (SINGLE EFFECT) -------- */
  useEffect(() => {
    if (!isRunning || !startTime || isPaused) return;

    const interval = setInterval(() => {
      const eventTime = new Date(inputEventDate).getTime();
      const now = Date.now();
      const diff = eventTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        setProgress(100);
        setIsRunning(false);
        
        // Trigger celebration
        setShowCelebration(true);
        
        // Auto-hide celebration after 5 seconds
        const celebrationTimer = setTimeout(() => {
          setShowCelebration(false);
        }, 5000);
        
        return () => clearTimeout(celebrationTimer);
      }

      const total = eventTime - startTime;
      const completed = total - diff;
      const percent = Math.min((completed / total) * 100, 100);
      setProgress(percent);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, inputEventDate, startTime]);

  /* -------- Controls -------- */
  const pauseCountdown = () => setIsPaused(true);
  const resumeCountdown = () => setIsPaused(false);

  const resetCountdown = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(null);
    setProgress(0);
    setStartTime(null);
    setInputEventName("");
    setInputEventDate("");
    setError("");
    setShowCelebration(false);

    localStorage.removeItem("eventName");
    localStorage.removeItem("eventDate");
    localStorage.removeItem("startTime");
  };

  /* -------- Close celebration -------- */
  const closeCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <div className="event-container">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="celebration-effect">
          <div className="celebration-content">
            <div className="celebration-title">🎉 Congratulations! 🎉</div>
            <div className="celebration-message">
              "{inputEventName}" has completed!
            </div>
            <div className="celebration-icons">
              <span className="celebration-icon">✨</span>
              <span className="celebration-icon">🥳</span>
              <span className="celebration-icon">🎊</span>
              <span className="celebration-icon">🎈</span>
              <span className="celebration-icon">🌟</span>
            </div>
            <button 
              className="celebration-close-btn"
              onClick={closeCelebration}
            >
              Awesome! 👍
            </button>
          </div>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="celebration-particle"
              style={{
                left: `${Math.random() * 95}%`,
                animationDelay: `${i * 0.1}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              {['🎉', '✨', '🌟', '🎊', '🎈', '🥳'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <h2>⏳ Event Countdown Timer</h2>

      <input
        type="text"
        placeholder="Enter Event Name"
        value={inputEventName}
        onChange={handleEventNameChange}
      />

      {error && <p className="error-text">{error}</p>}

      <label className="input-label">Event Date & Time</label>
      <input
        type="datetime-local"
        value={inputEventDate}
        onChange={(e) => setInputEventDate(e.target.value)}
        disabled={!inputEventName.trim()}
      />

      <button
        onClick={startCountdown}
        disabled={!inputEventName.trim() || !inputEventDate}
      >
        Start Countdown
      </button>

      {timeLeft && (
        <div className="timer-box">
          <h3>{inputEventName}</h3>

          {/* Progress Bar */}
          <div className="progress-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            >
              <span className="progress-shine"></span>
              {progress >= 100 && (
                <div className="progress-sparkles">
                  <span className="sparkle">✨</span>
                  <span className="sparkle">🌟</span>
                  <span className="sparkle">🎉</span>
                </div>
              )}
            </div>
          </div>

          <p className="progress-text">
            {Math.floor(progress)}% completed
            {progress >= 100 && " 🎉"}
          </p>

          {/* Time */}
          <div className="timer">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div className="time-unit" key={unit}>
                <span>{timeLeft[unit]}</span>
                <small>{unit}</small>
                {progress >= 100 && unit === "seconds" && (
                  <div className="time-celebrate">🎯</div>
                )}
              </div>
            ))}
          </div>

          <div className="controls">
            {!isPaused ? (
              <button onClick={pauseCountdown}>Pause ⏸</button>
            ) : (
              <button onClick={resumeCountdown}>Resume ▶️</button>
            )}
            <button onClick={resetCountdown}>Reset 🔄</button>
            {progress >= 100 && (
              <button 
                className="celebrate-again-btn"
                onClick={() => setShowCelebration(true)}
              >
                🎉 Celebrate Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCountdown;