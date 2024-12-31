import { IVideo } from "./video";

export interface ICourse {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  videos: IVideo[];
}
