import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayMode, Song } from "../types/GlobalTypes";
import { RootState } from "./store";

export type PlayState = {
  // 播放状态
  playing: boolean;

  // 播放模式
  playMode: PlayMode;

  // 歌曲列表
  songList: Song[];

  // 播放列表
  playList: Song[];

  // 当前正在播放的索引
  currentIndex: number;
};

const defaultState: PlayState = {
  playing: false,
  songList: [],
  playList: [],
  playMode: { type: "loop", label: "循环" },
  currentIndex: -1,
};

export const playerSlice = createSlice({
  name: "player",
  initialState: defaultState,
  reducers: {
    setPlaying: (state, action: PayloadAction<{ playing: boolean }>) => {
      return { ...state, playing: action.payload.playing };
    },
    setPlayList: (state, action: PayloadAction<{ playList: Song[] }>) => {
      return { ...state, playList: action.payload.playList };
    },
    setSongList: (state, action: PayloadAction<{ songList: Song[] }>) => {
      return { ...state, songList: action.payload.songList };
    },
    setPlayMode: (state, action: PayloadAction<{ playMode: PlayMode }>) => {
      return { ...state, playMode: action.payload.playMode };
    },
    setCurrentIndex: (
      state,
      action: PayloadAction<{ currentIndex: number }>
    ) => {
      return { ...state, currentIndex: action.payload.currentIndex };
    },
  },
});

export const {
  setPlaying,
  setPlayList,
  setSongList,
  setPlayMode,
  setCurrentIndex,
} = playerSlice.actions;

export const selectPlaying = (state: RootState) => state.playReducer.playing;
export const selectPlayList = (state: RootState) => state.playReducer.playList;
export const selectSongList = (state: RootState) => state.playReducer.songList;
export const selectPlayMode = (state: RootState) => state.playReducer.playMode;
export const selectCurrentIndex = (state: RootState) =>
  state.playReducer.currentIndex;

export const selectCurrentSong = (state: RootState) =>
  state.playReducer.playList[state.playReducer.currentIndex];

export default playerSlice.reducer;
