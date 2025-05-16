import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Tool {
  toolLink: string;
  summary: string;
  videoLink: string;
  title: string;
}

interface ToolCardProps {
  tool: Tool;
}

// Helper to extract YouTube video ID from a URL
function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export function AIToolCard({ tool }: ToolCardProps) {
  const domain = new URL(tool.toolLink).hostname.replace("www.", "");

  const toolName =
    domain.split(".")[0].charAt(0).toUpperCase() +
    domain.split(".")[0].slice(1);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${tool.toolLink}&sz=128`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={faviconUrl || "/placeholder.svg"}
                alt={toolName}
              />
              <AvatarFallback>{toolName.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <Badge variant="outline" className="font-normal">
              {domain}
            </Badge>
            <h3 className="font-medium text-sm mt-1">{toolName}</h3>
          </div>
        </CardHeader>
        <CardContent className="pb-3 flex-1">
          <motion.h2
            className="font-medium text-base line-clamp-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {tool.title}
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {tool.summary}
          </motion.p>
        </CardContent>
        {tool.videoLink && getYoutubeId(tool.videoLink) && (
          <div className="w-full px-4 flex justify-center mt-2 mb-4">
            <a
              href={tool.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden w-full relative"
              style={{ minHeight: '12rem' }}
            >
              <img
                src={`https://img.youtube.com/vi/${getYoutubeId(tool.videoLink)}/hqdefault.jpg`}
                alt="YouTube Tutorial Thumbnail"
                className="w-full h-48 object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/70 rounded-full p-3 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </span>
              </span>
            </a>
          </div>
        )}
        <div className="w-full px-4 pb-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" asChild className="w-full justify-center">
              <a
                href={tool.toolLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 justify-center w-full"
              >
                <ExternalLink size={14} />
                Visit Tool
              </a>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default AIToolCard;