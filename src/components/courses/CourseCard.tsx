import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onViewCourse: (course: Course) => void;
}

export function CourseCard({ course, onViewCourse }: CourseCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{course.level}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {course.duration}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col space-y-2">
          <div className="text-sm">
            <span className="font-medium">Instructor:</span> {course.instructor}
          </div>
          <div className="text-sm">
            <span className="font-medium">Videos:</span> {course.videos.length}
          </div>
          <div className="flex-1" />
          <Button className="w-full mt-4" onClick={() => onViewCourse(course)}>
            <PlayCircle className="mr-2 h-4 w-4" /> Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
