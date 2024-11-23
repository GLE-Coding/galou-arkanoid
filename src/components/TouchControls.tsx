import React, { useCallback, useEffect, useRef, useState } from 'react';

interface TouchControlsProps {
  onMove: (position: number) => void;
  onTap: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onMove, onTap }) => {
  const [lastTapTime, setLastTapTime] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartTimeRef.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (touchStartXRef.current !== null) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const position = (touch.clientX - rect.left) / rect.width;
      onMove(Math.max(0, Math.min(1, position)));
    }
  }, [onMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimeRef.current;

    // If the touch duration is short and there wasn't much movement, consider it a tap
    if (touchDuration < 200 && touchStartXRef.current !== null) {
      const now = Date.now();
      if (now - lastTapTime > 300) { // Prevent double taps
        onTap();
        setLastTapTime(now);
      }
    }
    touchStartXRef.current = null;
  }, [onTap, lastTapTime]);

  useEffect(() => {
    const element = document.documentElement;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return null;
};