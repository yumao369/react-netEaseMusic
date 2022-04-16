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

export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
}

export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
}

export type SongUrl = {
  id: number;
  url: string;
}

export type WySliderStyle = {
  width?: string | null;
  height?: string | null;
  left?: string | null;
  bottom?: string | null;
}

export type Callback = () => void