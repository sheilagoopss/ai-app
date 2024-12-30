"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Video, VideoType } from "@/types/video";
import { isValidYouTubeUrl, getYouTubeVideoId } from "@/utils/youtube";

interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (video: Partial<Video>) => void;
  initialData?: Video;
}

export function VideoForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: VideoFormProps) {
  const [type, setType] = useState<VideoType>(initialData?.type || "youtube");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [url, setUrl] = useState(initialData?.url || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (type === "youtube" && !isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    const videoData: Partial<Video> = {
      title: title.trim(),
      description: description.trim(),
      type,
      url: type === "youtube" ? getYouTubeVideoId(url)! : url,
    };

    onSubmit(videoData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Video" : "Add New Video"}
          </DialogTitle>
          <DialogDescription>
            Add a new course video by uploading a file or providing a YouTube
            link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Video Type</Label>
            <Select
              value={type}
              onValueChange={(value: VideoType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select video type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube Link</SelectItem>
                <SelectItem value="upload">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
          </div>
          {type === "youtube" ? (
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file">Video File</Label>
              <Input
                id="file"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
