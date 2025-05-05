import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AITool {
  title: string;
  description: string;
  url: string;
  source: string;
  source_name: string;
  relevance_score: number;
  metadata: {
    channel: string;
    views: string;
    video_id: string;
  };
}

interface AIToolCardProps {
  tool: AITool;
}

export function AIToolYoutubeCard({ tool }: AIToolCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${tool.metadata.video_id}/maxresdefault.jpg`;

  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-black"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="border border-gray-200 h-full overflow-hidden">
        <motion.div
          className="aspect-video"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={thumbnailUrl || "/placeholder.svg?height=200&width=400"}
            alt={tool.title}
            className="w-full h-full object-cover"
            unoptimized
            width={400}
            height={200}
          />
        </motion.div>
        <CardContent className="p-4">
          <motion.div
            className="mb-2 flex items-start justify-between gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-medium text-base">{tool.title}</h3>
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-500 mt-1" />
          </motion.div>

          <motion.p
            className="text-sm text-gray-700 line-clamp-2 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {tool.description}
          </motion.p>

          <motion.div
            className="pt-2 border-t border-gray-100 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {tool.metadata.channel}
              </span>
              <span className="text-xs text-gray-500">
                {tool.metadata.views}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.a>
  );
}
