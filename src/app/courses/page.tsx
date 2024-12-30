"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CourseFilter } from "@/components/courses/CourseFilter";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseViewer } from "@/components/courses/CourseViewer";
import { Course } from "@/types/course";
import { Search } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    category: "Web Development",
    instructor: "John Doe",
    duration: "6 hours",
    level: "Beginner",
    videos: [
      {
        id: "v1",
        title: "HTML Basics",
        description: "Learn the fundamentals of HTML",
        type: "youtube",
        url: "dQw4w9WgXcQ",
        createdAt: new Date(),
      },
      // Add more videos...
    ],
  },
  // Add more courses...
];

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = sampleCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleFilterChange = (
    type: "category" | "level",
    value: string | null,
  ) => {
    if (type === "category") {
      setSelectedCategory(value);
    } else {
      setSelectedLevel(value);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CourseFilter
            categories={categories}
            levels={levels}
            onFilterChange={handleFilterChange}
          />
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewCourse={setSelectedCourse}
              />
            ))}
          </div>
        )}
      </div>

      <CourseViewer
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}
