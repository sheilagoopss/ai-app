"use client";

import { useRouter } from "next/navigation";
import { CourseForm } from "@/components/courses/CourseForm";
import { Course } from "@/types/course";
import { message } from "antd";

export default function AddCourse() {
  const router = useRouter();

  const handleSubmit = async (courseData: Course) => {
    try {
      // In a real application, you would make an API call here
      console.log("Submitting course:", courseData);

      // Show success message
      message.success("Course created successfully!");

      // Redirect to courses page
      router.push("/courses");
    } catch (error) {
      console.error(error);
      message.error("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      <CourseForm onSubmit={handleSubmit} />
    </div>
  );
}
