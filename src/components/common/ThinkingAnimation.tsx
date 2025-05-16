import React from 'react';
import { SparklesIcon } from 'lucide-react';

interface ThinkingAnimationProps {
  sparkleBackgroundColor?: string;
  isThinking?: boolean;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ 
  sparkleBackgroundColor = '#E5E7FB',
  isThinking = true
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div 
        className="flex items-center justify-center w-14 h-14 rounded-full"
        style={{ backgroundColor: sparkleBackgroundColor }}
      >
        <SparklesIcon 
          className={`w-6 h-6 text-black ${isThinking ? '[animation:sparkle_2s_ease-in-out_infinite]' : ''}`} 
          fill="black" 
        />
      </div>
      <div className="flex gap-1.5 items-center h-10 px-4 py-2 rounded-2xl bg-white">
        <div className={`w-2 h-2 rounded-full bg-black ${isThinking ? '[animation:high-bounce_1s_infinite]' : ''}`} style={{ animationDelay: '0ms' }} />
        <div className={`w-2 h-2 rounded-full bg-black ${isThinking ? '[animation:high-bounce_1s_infinite]' : ''}`} style={{ animationDelay: '200ms' }} />
        <div className={`w-2 h-2 rounded-full bg-black ${isThinking ? '[animation:high-bounce_1s_infinite]' : ''}`} style={{ animationDelay: '400ms' }} />
      </div>
      <style jsx>{`
        @keyframes high-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }
        
        @keyframes sparkle {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ThinkingAnimation; 