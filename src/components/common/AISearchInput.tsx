import React from 'react';
import { Wand2 } from 'lucide-react';

interface AISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

const AISearchInput: React.FC<AISearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  buttonText = "Generate",
  placeholder = "Describe what you're looking for...",
  className = "",
}) => {
  return (
    <div className={`flex overflow-hidden flex-col justify-center self-center p-8 max-w-full bg-white rounded-[48px] w-[552px] max-md:px-5 ${className}`}>
      <form onSubmit={onSubmit} className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-col w-full text-base leading-tight text-black max-w-[486px] max-md:max-w-full">
          <textarea
            id="search"
            className="flex-1 shrink gap-4 self-stretch px-4 py-3.5 mt-2 w-full bg-white border-gray-200 border-solid border-[1.5px] rounded-[24px] max-md:max-w-full resize-none min-h-[120px]"
            placeholder={placeholder}
            aria-label="Search for AI tools"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex flex-wrap gap-2.5 justify-center items-center px-8 py-3 mt-6 w-full text-base font-semibold leading-tight text-white whitespace-nowrap bg-neutral-900 min-h-[48px] rounded-[48px] max-md:px-5 max-md:max-w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="self-stretch my-auto">{buttonText}</span>
          <Wand2 className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default AISearchInput; 