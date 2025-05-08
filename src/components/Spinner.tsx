
import React, { useState, useEffect, useRef } from 'react';

interface SpinnerProps {
  options: { id: string; text: string }[];
  onSpinComplete?: (option: { id: string; text: string }) => void;
  autoSpin?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ options, onSpinComplete, autoSpin = false }) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);
    
    // Choose a random option
    const selectedIndex = Math.floor(Math.random() * options.length);
    const segmentSize = 360 / options.length;
    
    // Calculate rotation to make sure the selected segment lands at the top
    // Add many full rotations for effect
    const fullRotations = 5;
    const baseRotation = fullRotations * 360;
    
    // Calculate target position for selected segment
    // We want the selector to point to the middle of the segment
    const segmentMiddle = (selectedIndex * segmentSize) + (segmentSize / 2);
    
    // Final rotation = full rotations + position to make selector point to segment middle + small random offset
    const targetRotation = baseRotation + (360 - segmentMiddle) + (Math.random() * 20 - 10);
    
    // Animate the spin
    setRotation(targetRotation);
    
    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedOption(selectedIndex);
      if (onSpinComplete) {
        onSpinComplete(options[selectedIndex]);
      }
    }, 3000); // Match this to the CSS transition duration
  };

  useEffect(() => {
    if (autoSpin) {
      const timer = setTimeout(() => {
        spinWheel();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSpin]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64">
        {/* Spinner wheel */}
        <div 
          ref={spinnerRef}
          className="w-full h-full rounded-full shadow-xl border-4 border-game-primary overflow-hidden transition-transform duration-3000"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : ''
          }}
        >
          {/* Spinner segments */}
          {options.map((option, index) => {
            const segmentSize = 360 / options.length;
            const startAngle = index * segmentSize;
            
            return (
              <div 
                key={option.id}
                className={`absolute top-0 left-0 w-full h-full origin-bottom-center overflow-hidden`}
                style={{ 
                  transform: `rotate(${startAngle}deg) skew(${90 - segmentSize}deg)`,
                  backgroundColor: index % 2 === 0 ? '#8B5CF6' : '#7E69AB'
                }}
              >
                <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 rotate-[30deg] text-white font-bold text-xs whitespace-nowrap">
                  {option.text}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Spinner pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-game-accent z-10">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-game-accent" />
        </div>
      </div>
      
      {!autoSpin && (
        <button
          onClick={spinWheel}
          disabled={isSpinning || options.length === 0}
          className="px-4 py-2 bg-game-primary text-white rounded-md shadow-md hover:bg-game-secondary transition-colors disabled:opacity-50"
        >
          {isSpinning ? 'Spinning...' : 'Spin Wheel'}
        </button>
      )}
      
      {selectedOption !== null && !isSpinning && (
        <div className="mt-4 text-center">
          <p className="font-medium">Selected: <span className="text-game-primary">{options[selectedOption]?.text}</span></p>
        </div>
      )}
    </div>
  );
};

export default Spinner;
