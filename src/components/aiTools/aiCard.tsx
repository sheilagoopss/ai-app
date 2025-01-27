import { Info, LinkIcon } from "lucide-react";

import { Image } from "antd";
import { Tool } from "@/types/tools";
import { Clock } from "lucide-react";

const AiCard: React.FC<{ tool: Tool; index: number }> = ({ tool, index }) => {
  const isBlue = index % 2 === 0;

  return (
    <div
      key={index}
      className={`relative overflow-hidden rounded-xl p-6 ${
        isBlue ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
      }`}
    >
      <div className="space-y-4">
        {tool.toolIcon && (
          <div className="flex justify-center mb-4">
            <Image
              src={tool.toolIcon}
              alt=""
              className="h-16 w-16 rounded-full border-2 border-white/50"
              width={64}
              height={64}
              preview={false}
            />
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{tool.toolName}</h2>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Source URL</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 opacity-80" />
            <p className="text-sm opacity-80 line-clamp-2">
              {tool.toolInfoLink}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Tool description</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 opacity-80" />
            <p className="text-sm opacity-80 line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Category</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 opacity-80" />
            <p className="text-sm opacity-80 line-clamp-2">{tool.toolTask}</p>
          </div>
        </div>

        <a
          href={tool.toolInfoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg bg-white/ 20 px-4 py-2 text-center font-medium hover:bg-white/30"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default AiCard;
