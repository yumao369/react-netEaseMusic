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
  alias: string[];
  picUrl: string;
  albumSize: number;
};

export type SingerDetail = {
  artist: Singer;
  hotSongs: Song[];
}

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
  trackCount: number;
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

export type SearchResult = {
  artists?: Singer[];
  playlists?: SongSheet[];
  songs?: Song[];
}

export type User = {
  // 等级
  level?: number;

  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
};

export type Signin = {
  point?: number
}

export type recordVal = {
  playCount: number;
  score: number;
  song: Song;
};

type recordKeys = 'weekData' | 'allData';

export type UserRecord = {
  [key in recordKeys]: recordVal[];
}

export type UserSheet = {
  self: SongSheet[],
  subscribed: SongSheet[]
}

export type LikeSongParams = {
  pid: string;
  tracks: string;
}

export type CreateSheetResponse = {
  id: string
}

export type AnyJson = {
  [key: string]: any
}

export type BaseResponse = {
  code: number;
  msg?: string;
  message?: string
}
