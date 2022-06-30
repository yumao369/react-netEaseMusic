export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
};

export type HotTag = {
  id: number;
  name: string;
  position: number;
};

export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
};

export type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
};

export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
};

export type Lyric = {
  lyric: string;
  //translated lyric(normally refers to chinese translation of other language version)
  tlyric: string
}

export type SongSheet = {
  id: number;
  userId: number;
  name: string;
  picUrl: string;
  coverImgUrl: string;
  playCount: number;
  tags: string[];
  createTime: number;
  creator: { nickname: string; avatarUrl: string; };
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  subscribed: boolean;
  tracks: Song[];
};

export type SongUrl = {
  id: number;
  url: string;
};

export type WySliderStyle = {
  width?: string | null;
  height?: string | null;
  left?: string | null;
  bottom?: string | null;
};

export type Callback = () => void;

//redux
export type Action = {
  type: string;
  data: any;
};

//wy-player types
export type PlayMode = {
  type: "loop" | "random" | "singleLoop";
  label: "循环" | "随机" | "单曲循环";
};

export type SheetParams = {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string;
}

export type SheetList = {
  playlists: SongSheet[];
  total: number;
}

export type Control = {
  isExpand: boolean,
  label: '展开' | '收起',
  iconCls: 'up' | 'down'
}
