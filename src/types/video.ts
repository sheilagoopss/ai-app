export type VideoType = 'youtube' | 'upload';

export interface Video {
  id: string;
  title: string;
  description: string;
  type: VideoType;
  url: string;
  thumbnail?: string;
  createdAt: Date;
}

