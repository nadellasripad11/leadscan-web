"use client";

import { useEffect, useState } from "react";

export function TypingAnimation({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setDisplayedText("");
        let charIndex = 0;
        const interval = setInterval(() => {
          if (charIndex < text.length) {
            setDisplayedText(text.slice(0, charIndex + 1));
            // Play subtle typing sound
            playTypeSound();
            charIndex++;
          } else {
            clearInterval(interval);
          }
        }, 50);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [text, delay]);

  const playTypeSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // 800 Hz beep
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  return <>{displayedText}</>;
}
