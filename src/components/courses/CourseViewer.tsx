import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCard } from "@/components/courses/VideoCard";
import { ICourse } from "@/types/course";

interface CourseViewerProps {
  course: ICourse | null;
  onClose: () => void;
}

export function CourseViewer({ course, onClose }: CourseViewerProps) {
  if (!course) return null;

  return (
    <Dialog open={!!course} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 mb-10">
            {course.videos.map((video, index) => (
              <div key={video.id} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <VideoCard
                    video={video}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
