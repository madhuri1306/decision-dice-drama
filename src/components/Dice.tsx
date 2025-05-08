
import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  onRollComplete?: (value: number) => void;
  autoRoll?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete, autoRoll = false }) => {
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Dice faces with Lucide icons
  const DiceFaces = [
    <Dice1 key={1} className="w-full h-full text-game-primary" />,
    <Dice2 key={2} className="w-full h-full text-game-primary" />,
    <Dice3 key={3} className="w-full h-full text-game-primary" />,
    <Dice4 key={4} className="w-full h-full text-game-primary" />,
    <Dice5 key={5} className="w-full h-full text-game-primary" />,
    <Dice6 key={6} className="w-full h-full text-game-primary" />
  ];

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    
    // Animate through dice faces
    let duration = 0;
    let interval = 100;
    const animationInterval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      duration += interval;
      
      if (duration >= 2000) {
        clearInterval(animationInterval);
        // Final result
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
        
        if (onRollComplete) {
          onRollComplete(finalValue);
        }
      }
    }, interval);
  };

  useEffect(() => {
    if (autoRoll) {
      const timer = setTimeout(() => {
        rollDice();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoRoll]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`w-24 h-24 rounded-xl shadow-lg flex items-center justify-center bg-white border-2 border-game-primary ${
          isRolling ? 'animate-dice-roll' : ''
        }`}
      >
        {DiceFaces[value - 1]}
      </div>
      {!autoRoll && (
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="px-4 py-2 bg-game-primary text-white rounded-md shadow-md hover:bg-game-secondary transition-colors disabled:opacity-50"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      )}
    </div>
  );
};

export default Dice;
