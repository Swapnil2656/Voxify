import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioWaveform = ({ audioURL, isRecording, darkMode, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Load audio and get duration when URL changes
  useEffect(() => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        console.log(`Audio loaded, duration: ${audio.duration}s`);
      };
      audioRef.current = audio;

      // Set up event listeners
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      return () => {
        audio.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [audioURL]);

  // Update current time during playback
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateTime);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Play/pause audio
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Reset to beginning if ended
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  };

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="mt-4 rounded-xl overflow-hidden shadow-soft"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {isRecording ? (
          <div className="card p-6 border-2 border-red-500/30 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center justify-center">
              <div className="audio-bars">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="audio-bar bg-red-500 dark:bg-red-400"></div>
                ))}
              </div>
              <div className="ml-4">
                <span className="font-medium text-red-600 dark:text-red-400 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                  Recording in progress
                </span>
                <span className="text-xs text-red-500/70 dark:text-red-400/70 mt-1 block">Speak clearly into your microphone</span>
              </div>
            </div>
          </div>
        ) : audioURL ? (
          <div className="card shadow-sm">
            <div className="p-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600 dark:text-blue-400">
                    <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                    <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recorded Audio</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)} duration</p>
                </div>
              </div>

              {/* Simple audio visualization */}
              <div
                className="h-20 bg-blue-50 dark:bg-blue-900/20 rounded-md overflow-hidden cursor-pointer"
                onClick={togglePlayback}
              >
                {/* Audio bars visualization */}
                <div className="h-full w-full flex items-end justify-around px-1">
                  {[...Array(30)].map((_, i) => {
                    // Create a pattern of bar heights
                    const height = 30 + Math.sin(i * 0.5) * 25 + Math.cos(i * 0.3) * 15;
                    const heightPercentage = `${height}%`;
                    const isActive = (i / 30) * 100 <= progressPercentage;

                    return (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t-sm ${isActive ? 'bg-blue-500 dark:bg-blue-400' : 'bg-blue-200 dark:bg-blue-800/50'}`}
                        style={{ height: heightPercentage }}
                      />
                    );
                  })}
                </div>

                {/* Progress overlay */}
                <div
                  className="h-1 bg-blue-500 dark:bg-blue-400 absolute bottom-0 left-0 transition-all duration-100"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="card-footer flex items-center justify-between">
              <motion.button
                onClick={togglePlayback}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>

              {onDelete && (
                <motion.button
                  onClick={onDelete}
                  className="btn btn-outline btn-sm text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Delete recording"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                  Delete
                </motion.button>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500 dark:text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No audio recorded yet</p>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 text-center max-w-xs">
              Click the microphone button below to start recording your voice
            </p>
            <div className="mt-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioWaveform;
