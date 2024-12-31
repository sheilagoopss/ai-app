"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CourseFilter } from "@/components/courses/CourseFilter";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseViewer } from "@/components/courses/CourseViewer";
import { ICourse } from "@/types/course";
import { Search } from "lucide-react";
import { useGetCourses } from "@/hooks/useCourse";
import { Spin } from "antd";

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const { getCourses, isFetchingCourses } = useGetCourses();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const filteredCourses = courses.filter((course) => {
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

  useEffect(() => {
    getCourses().then((courses) => {
      setCourses(courses);
    });
  }, [getCourses]);

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
      <div className="flex justify-center items-center h-screen">
        <Spin spinning={isFetchingCourses} />
      </div>
    </div>
  );
}
