"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/courses/VideoCard";
import { VideoForm } from "@/components/courses/VideoForm";
import { Video } from "@/types/video";
import dayjs from "dayjs";

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | undefined>();

  const handleAddVideo = (videoData: Partial<Video>) => {
    const newVideo: Video = {
      createdAt: dayjs().toISOString(),
      ...videoData,
    } as Video;

    setVideos((prev) => [...prev, newVideo]);
  };

  const handleEditVideo = (videoData: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === editingVideo?.id ? { ...video, ...videoData } : video,
      ),
    );
    setEditingVideo(undefined);
  };

  const handleDeleteVideo = (video: Video) => {
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Videos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Video
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={(video) => {
              setEditingVideo(video);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteVideo}
          />
        ))}
      </div>

      <VideoForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingVideo(undefined);
        }}
        onSubmit={editingVideo ? handleEditVideo : handleAddVideo}
        initialData={editingVideo}
      />

      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No videos added yet. Click the Add Video button to get started.
          </p>
        </div>
      )}
    </div>
  );
}
