import { useState, useEffect, useRef } from 'react';

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [error, setError] = useState(null);

  // Use refs to maintain state between renders
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Clean up function to handle all resource cleanup
  const cleanup = () => {
    // Stop the media recorder if it's active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping recorder during cleanup:', err);
      }
    }

    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Revoke any object URLs
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return cleanup;
  }, [audioURL]);

  // Simple function to play a beep sound
  const playBeep = (frequency = 440, duration = 0.2) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (err) {
      console.warn('Could not play beep sound:', err);
    }
  };

  const startRecording = async () => {
    // Reset state
    setError(null);
    audioChunksRef.current = [];

    try {
      console.log('Requesting microphone access...');

      // Request microphone access with simple settings
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      console.log('Microphone access granted, creating MediaRecorder...');

      // Create a new MediaRecorder with default settings
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      // Set up data handling
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Received audio chunk: ${event.data.size} bytes`);
          audioChunksRef.current.push(event.data);
        }
      };

      // Set up stop handling
      recorder.onstop = () => {
        console.log('Recording stopped, processing audio...');
        processAudioData();
      };

      // Set up error handling
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError(`Recording error: ${event.error?.message || 'Unknown error'}`);
        setIsRecording(false);
      };

      // Start recording
      recorder.start(100); // Collect data frequently
      setIsRecording(true);
      console.log('Recording started successfully');

      // Play a beep to indicate recording has started
      playBeep(440, 0.2); // A4 note

    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Could not start recording: ${err.message || 'Unknown error'}`);
    }
  };

  const stopRecording = () => {
    if (!isRecording) {
      console.warn('Cannot stop recording: not currently recording');
      return;
    }

    console.log('Stopping recording...');

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped');
      }

      // Stop microphone access
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Audio track stopped: ${track.kind}`);
        });
      }

      setIsRecording(false);

      // Play a beep to indicate recording has stopped
      playBeep(880, 0.2); // A5 note

    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(`Error stopping recording: ${err.message || 'Unknown error'}`);
      setIsRecording(false);
    }
  };

  // Process the recorded audio data
  const processAudioData = () => {
    const chunks = audioChunksRef.current;

    if (!chunks.length) {
      console.error('No audio chunks recorded');
      setError('No audio was recorded. Please try again.');
      return;
    }

    try {
      console.log(`Processing ${chunks.length} audio chunks...`);

      // Create a blob from the audio chunks
      const blob = new Blob(chunks, { type: 'audio/webm' });
      console.log(`Created audio blob: ${blob.size} bytes`);

      if (blob.size < 100) {
        setError('Recording too short or empty. Please try again.');
        return;
      }

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Update state
      setAudioBlob(blob);
      setAudioURL(url);
      console.log('Audio processing complete');

      // Create a test audio element to verify the recording
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        console.log(`Audio duration: ${audio.duration} seconds`);
      };

      // Uncomment to automatically play the recording for testing
      // audio.play();

    } catch (err) {
      console.error('Error processing audio:', err);
      setError(`Error processing audio: ${err.message || 'Unknown error'}`);
    }
  };

  const clearRecording = () => {
    console.log('Clearing recording...');

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioBlob(null);
    setAudioURL('');
    audioChunksRef.current = [];
    setError(null);

    console.log('Recording cleared');
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    audioURL,
    clearRecording,
    error
  };
};

export default useAudioRecorder;
