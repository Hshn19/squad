import { useState, useRef } from 'react';

export function useVoice({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  function isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  function start() {
    if (!isSupported()) {
      onError?.('Speech recognition not supported. Use Chrome.');
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-MY';
    rec.continuous = false;
    rec.interimResults = false;
    recognitionRef.current = rec;

    rec.onstart = () => setListening(true);

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      onResult?.(transcript);
    };

    rec.onerror = (e) => {
      setListening(false);
      onError?.(e.error || 'Mic error');
    };

    rec.onend = () => setListening(false);

    rec.start();
  }

  function stop() {
    recognitionRef.current?.abort();
    setListening(false);
  }

  return { start, stop, listening, isSupported };
}