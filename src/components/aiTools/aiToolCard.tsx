import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Tool {
  toolLink: string;
  summary: string;
  videoLink: string;
  title: string;
}

interface ToolCardProps {
  tool: Tool;
}

// Add this at the top level of the file, outside any component
let isYoutubeApiLoaded = false;
let pendingInitializations: (() => void)[] = [];

// Helper to load YouTube API
function loadYoutubeApi() {
  if (isYoutubeApiLoaded) return Promise.resolve();
  
  return new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      isYoutubeApiLoaded = true;
      resolve();
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready callback triggered');
      isYoutubeApiLoaded = true;
      // Initialize all pending players
      pendingInitializations.forEach(init => init());
      pendingInitializations = [];
      resolve();
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
}

// Helper to extract YouTube video ID from a URL
function getYoutubeId(url: string) {
  if (!url) {
    console.error('No URL provided to getYoutubeId');
    return null;
  }
  
  // Handle direct video IDs
  if (/^[\w-]{11}$/.test(url)) {
    return url;
  }

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([\w-]{11})/,
    /youtube\.com\/watch\?.*&v=([\w-]{11})/,
    /youtube\.com\/watch\?.*v=([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log('✅ [YouTube] Successfully extracted video ID:', match[1], 'from URL:', url);
      return match[1];
    }
  }

  console.error('❌ [YouTube] Could not extract video ID from URL:', url);
  return null;
}

export function AIToolCard({ tool }: ToolCardProps) {
  const domain = new URL(tool.toolLink).hostname.replace("www.", "");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  const toolName =
    domain.split(".")[0].charAt(0).toUpperCase() +
    domain.split(".")[0].slice(1);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${tool.toolLink}&sz=128`;

  useEffect(() => {
    // Function to initialize the player
    const initializePlayer = () => {
      const videoId = getYoutubeId(tool.videoLink);
      console.log('Initializing player for video:', videoId, 'from URL:', tool.videoLink);
      if (videoId) {
        playerRef.current = new YT.Player(`youtube-player-${videoId}`, {
          height: '192',
          width: '100%',
          videoId: videoId,
          playerVars: {
            'playsinline': 1,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1
          },
          events: {
            'onStateChange': (event: YT.OnStateChangeEvent) => {
              console.log('Player state changed:', event.data);
              setIsPlaying(event.data === YT.PlayerState.PLAYING);
            },
            'onReady': () => {
              console.log('Player is ready for video:', videoId);
            },
            'onError': (event: YT.OnErrorEvent) => {
              console.error('Player error for video:', videoId, event.data);
            }
          }
        });
      } else {
        console.error('Could not extract video ID from URL:', tool.videoLink);
      }
    };

    // Load YouTube API if not already loaded
    if (!isYoutubeApiLoaded) {
      console.log('Loading YouTube API');
      pendingInitializations.push(initializePlayer);
      loadYoutubeApi();
    } else {
      console.log('YouTube API already loaded, initializing player');
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [tool.videoLink]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

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
            className="font-medium text-base line-clamp-2 mb-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            dir="rtl"
          >
            {tool.title}
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground line-clamp-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            dir="rtl"
          >
            {tool.summary}
          </motion.p>
        </CardContent>
        {tool.videoLink && getYoutubeId(tool.videoLink) && (
          <div className="w-full px-4 flex flex-col items-center mt-2 mb-4">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ minHeight: '12rem' }}>
              <div id={`youtube-player-${getYoutubeId(tool.videoLink)}`} className="w-full h-48" />
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white" />
                )}
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground hover:text-primary"
              asChild
            >
            <a
              href={tool.videoLink}
              target="_blank"
              rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink size={14} />
                צפה ב-YouTube
              </a>
            </Button>
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
                dir="rtl"
              >
                <ExternalLink size={14} />
                ביקור בכלי
              </a>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default AIToolCard;