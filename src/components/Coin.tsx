
import React, { useState, useEffect } from 'react';

interface CoinProps {
  options: { id: string; text: string }[];
  onFlipComplete?: (option: { id: string; text: string }) => void;
  autoFlip?: boolean;
}

const Coin: React.FC<CoinProps> = ({ options, onFlipComplete, autoFlip = false }) => {
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);

  // Ensure we have only 2 options for the coin
  const coinOptions = options.slice(0, 2);

  const flipCoin = () => {
    if (isFlipping || coinOptions.length < 2) return;

    setIsFlipping(true);
    setResult(null);
    
    // Sound effect would be nice here
    
    setTimeout(() => {
      // Randomly choose heads (0) or tails (1)
      const flipResult = Math.floor(Math.random() * 2);
      setResult(flipResult);
      setIsFlipping(false);
      
      if (onFlipComplete) {
        onFlipComplete(coinOptions[flipResult]);
      }
    }, 2000);
  };

  useEffect(() => {
    if (autoFlip) {
      const timer = setTimeout(() => {
        flipCoin();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoFlip]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`w-32 h-32 rounded-full relative ${isFlipping ? 'animate-flip' : ''}`}
        style={{ 
          perspective: '1000px', 
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Heads side */}
        <div 
          className={`absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold p-2 text-center border-4 border-yellow-300 shadow-lg`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: isFlipping ? 'rotateY(0deg)' : result === 1 ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 1s ease-out'
          }}
        >
          {coinOptions[0]?.text || 'Option 1'}
        </div>
        
        {/* Tails side */}
        <div 
          className={`absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold p-2 text-center border-4 border-purple-400 shadow-lg`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: isFlipping ? 'rotateY(180deg)' : result === 1 ? 'rotateY(0deg)' : 'rotateY(180deg)',
            transition: 'transform 1s ease-out'
          }}
        >
          {coinOptions[1]?.text || 'Option 2'}
        </div>
      </div>
      
      {!autoFlip && (
        <button
          onClick={flipCoin}
          disabled={isFlipping || coinOptions.length < 2}
          className="px-4 py-2 bg-game-primary text-white rounded-md shadow-md hover:bg-game-secondary transition-colors disabled:opacity-50"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
      
      {result !== null && !isFlipping && (
        <div className="mt-4 text-center">
          <p className="font-medium">
            Result: <span className="text-game-primary">{coinOptions[result]?.text}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Coin;
