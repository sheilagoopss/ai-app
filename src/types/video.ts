export type VideoType = 'youtube' | 'upload';

export interface IVideo {
  id: string;
  title: string;
  description: string;
  type: VideoType;
  url: string | File;
  thumbnail?: string;
  createdAt: Date;
}

