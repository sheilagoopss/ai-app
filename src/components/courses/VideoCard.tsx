import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IVideo } from "@/types/video";
import { getYouTubeVideoId } from "@/utils/youtube";

interface VideoCardProps {
  video: IVideo;
  onEdit: (video: IVideo) => void;
  onDelete: (video: IVideo) => void;
}

export function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        {video.type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={video.url}
            className="absolute inset-0 w-full h-full object-cover"
            controls
          />
        )}
      </div>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1">{video.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {video.description}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(video)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(video)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
