import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, X } from "lucide-react";
import { IVideo } from "@/types/video";
import DragDropUpload from "../common/DragDropUpload";

interface VideoInputProps {
  index: number;
  onRemove: () => void;
  onChange: (index: number, data: any) => void;
  error?: string;
  video: Partial<IVideo>;
}

export function VideoInput({
  index,
  onRemove,
  onChange,
  error,
  video,
}: VideoInputProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-2">
        <Label htmlFor={`video-type-${index}`}>Video Type</Label>
        <Select
          onValueChange={(value) => onChange(index, { type: value })}
          defaultValue="youtube"
        >
          <SelectTrigger id={`video-type-${index}`}>
            <SelectValue placeholder="Select video type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube Link</SelectItem>
            <SelectItem value="upload">File Upload</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`video-title-${index}`}>Title</Label>
        <Input
          id={`video-title-${index}`}
          placeholder="Enter video title"
          onChange={(e) => onChange(index, { title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`video-description-${index}`}>Description</Label>
        <Textarea
          id={`video-description-${index}`}
          placeholder="Enter video description"
          onChange={(e) => onChange(index, { description: e.target.value })}
        />
      </div>

      {video.type === "youtube" && (
        <div className="space-y-2">
          <Label htmlFor={`video-url-${index}`}>Video URL/File</Label>
          <Input
            id={`video-url-${index}`}
            type="text"
            placeholder="Enter YouTube URL or upload a file"
            onChange={(e) => onChange(index, { url: e.target.value })}
          />
        </div>
      )}

      {video.type === "upload" && (
        <div className="space-y-2">
          <DragDropUpload
            multiple={false}
            handleUpload={(e) => onChange(index, { url: e[0] })}
            fileType=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm"
            fileValidation="video/"
          />
          {video.url && (
            <div className="flex flex-col items-center gap-2">
              <video
                src={typeof video.url === "string" ? video.url : URL.createObjectURL(video.url)}
                controls
                className="w-full h-auto"
              />
              <Button
                variant="outline"
                onClick={() => onChange(index, { url: "" })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
