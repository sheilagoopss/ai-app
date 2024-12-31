"use client";

import { CourseForm } from "@/components/courses/CourseForm";
import { ICourse } from "@/types/course";
import { message } from "antd";
import { useAddCourse } from "@/hooks/useCourse";
import { useState } from "react";
import { IVideo } from "@/types/video";

export default function AddCourse() {
  const { addCourse, isAddingCourse } = useAddCourse();
  const [videos, setVideos] = useState<Array<Partial<IVideo>>>([]);
  const [formData, setFormData] = useState<Omit<ICourse, "id">>({
    title: "",
    description: "",
    category: "",
    instructor: "",
    duration: "",
    level: "Beginner" as ICourse["level"],
    videos: [],
  });

  const handleSubmit = async (courseData: ICourse) => {
    try {
      const course = await addCourse(courseData);
      if (course) {
        message.success("Course created successfully!");
        setFormData({
          title: "",
          description: "",
          category: "",
          instructor: "",
          duration: "",
          level: "Beginner" as ICourse["level"],
          videos: [],
        });
        setVideos([]);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <CourseForm
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isAddingCourse={isAddingCourse}
        videos={videos}
        setVideos={setVideos}
      />
    </div>
  );
}
