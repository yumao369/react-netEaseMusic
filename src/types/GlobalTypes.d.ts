export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
}

export type HotTag = {
  id: number;
  name: string;
  position: number;
}

export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}

export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}

export type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
}

export type Callback = () => void