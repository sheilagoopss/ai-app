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
      <Card className="overflow-hidden transition-all hover:shadow-md">
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
        <CardContent className="pb-3">
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
        <CardFooter className="flex justify-between pt-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" asChild>
              <a
                href={tool.toolLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink size={14} />
                Visit Tool
              </a>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="secondary" size="sm" asChild>
              <a
                href={tool.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Play size={14} />
                Tutorial
              </a>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default AIToolCard;
