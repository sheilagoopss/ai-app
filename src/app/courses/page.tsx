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
import { Open_Sans } from "next/font/google";

const openSansHebrew = Open_Sans({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans-hebrew",
});

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
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
    <section
      className={`min-h-screen w-full py-16 md:py-24 ${openSansHebrew.variable} font-sans bg-[#FFA87F]`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-2 text-black">
            קורסים וסדנאות
          </h2>
        </div>
      </div>
    </section>
  );
}
