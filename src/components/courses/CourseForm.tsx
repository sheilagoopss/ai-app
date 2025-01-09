"use client";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VideoInput } from "@/components/courses/VideoInput";
import { Plus } from "lucide-react";
import { ICourse } from "@/types/course";
import { isValidYouTubeUrl, getYouTubeVideoId } from "@/utils/youtube";
import { IVideo } from "@/types/video";
import { Button } from "antd";
import { useFileUpload } from "@/hooks/useFileUpload";

interface CourseFormProps {
  onSubmit: (course: ICourse) => void;
  formData: Omit<ICourse, "id">;
  setFormData: (formData: Omit<ICourse, "id">) => void;
  isAddingCourse: boolean;
  videos: Array<Partial<IVideo>>;
  setVideos: (videos: Array<Partial<IVideo>>) => void;
}

export function CourseForm({
  onSubmit,
  formData,
  setFormData,
  videos,
  setVideos,
  isAddingCourse,
}: CourseFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { uploadFiles, isUploading } = useFileUpload();

  const handleVideoChange = (index: number, data: Partial<IVideo>) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], ...data };
    setVideos(updated);
  };

  const addVideo = () => {
    setVideos([...videos, {}]);
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    videos.forEach((video, index) => {
      if (!video.title?.trim()) {
        newErrors[`video-${index}`] = "Video title is required";
      }
      if (video.type === "youtube" && !isValidYouTubeUrl(video.url as string || "")) {
        newErrors[`video-${index}`] = "Invalid YouTube URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const processedVideos: IVideo[] = [];

    for (const video of videos) {
      if (video.type === "youtube") {
        processedVideos.push({
          ...video,
          id: Math.random().toString(36).substring(2, 9),
          url:
            video.type === "youtube"
              ? getYouTubeVideoId(video.url as string || "") || ""
              : video.url || "",
          createdAt: new Date(),
        } as IVideo);
      } else {
        const url = await uploadFiles([video.url as File]);
        processedVideos.push({
          ...video,
          id: Math.random().toString(36).substring(2, 9),
          url: url[0],
          createdAt: new Date(),
        } as IVideo);
      }
    }

    const courseData: ICourse = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      videos: processedVideos,
    };

    onSubmit(courseData);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Add a new course with multiple videos for your students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  placeholder="Enter instructor name"
                />
                {errors.instructor && (
                  <p className="text-sm text-red-500">{errors.instructor}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter course description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Mobile Development">
                      Mobile Development
                    </SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: ICourse["level"]) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 6 hours"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Course Videos</h3>
              <Button
                onClick={addVideo}
                icon={<Plus className="h-4 w-4 mr-2" />}
              >
                Add Video
              </Button>
            </div>

            <div className="space-y-4">
              {videos.map((_, index) => (
                <VideoInput
                  key={index}
                  index={index}
                  onRemove={() => removeVideo(index)}
                  onChange={handleVideoChange}
                  error={errors[`video-${index}`]}
                  video={videos[index]}
                />
              ))}
            </div>

            {videos.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No videos added yet. Click the Add Video button to add course
                videos.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              disabled={videos.length === 0}
              loading={isAddingCourse || isUploading}
              htmlType="submit"
            >
              Create Course
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
