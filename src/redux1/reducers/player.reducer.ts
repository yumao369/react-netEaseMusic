import { Action, PlayMode, Song } from "../../types/GlobalTypes";
import { SET_CURRENT_INDEX, SET_PLAYING, SET_PLAY_LIST, SET_PLAY_MODE, SET_SONG_LIST } from "../actions/player.action";

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
}

const defaultState: PlayState = {
  playing: false,
  songList: [],
  playList: [],
  playMode: { type: 'loop', label: '循环' },
  currentIndex: -1
}

const reducer = (state = defaultState, action: Action) => {
  const { type, data } = action
  switch (type) {
    case SET_PLAYING:
      return {
        ...state,
        playing: data.playing
      }
    case SET_PLAY_LIST:
      return {
        ...state,
        playList: data.playList
      }
    case SET_SONG_LIST:
      return {
        ...state,
        songList: data.songList
      }
    case SET_PLAY_MODE:
      return {
        ...state,
        plsyMode: data.plsyMode
      }
    case SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: data.currentIndex
      }
    default:
      return state
  }
}

export default reducer