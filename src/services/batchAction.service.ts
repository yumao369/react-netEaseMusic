import { playsheet } from "./sheet.service";
import store from "../redux/store";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSongList, setCurrentIndex, setPlayList, setSongList } from "../redux/playerSlice"
import { Song } from "../types/GlobalTypes";
import { findIndex } from "../utils/array";
import { ModalTypes, setModalType, setModalVisible } from "../redux/memberSlice";

/**
 * optimize
 * there are some ways to dispatch an aciton in a function
 * outside a component,just look at the article attached,and 
 * the best way here to dispatch an aciton is to encapsulate
 * a hook function,but now we dispatch by accessing store.
 * https://getridbug.com/reactjs/usedispatch-in-a-function-outside-react-component-redux-tool-kit/
 */

export const onPlaySheetBatch = async (id: number) => {
  const list = await playsheet(id);
  console.log("list", list);
  store.dispatch(setSongList({ songList: list }));
  store.dispatch(setPlayList({ playList: list }));
  store.dispatch(setCurrentIndex({ currentIndex: 0 }));
}

export const insertSong = (song: Song, isPlay: boolean) => {
  const songList = store.getState().playReducer.songList.slice()
  const playList = store.getState().playReducer.playList.slice()
  let insertIndex = store.getState().playReducer.currentIndex
  const pIndex = findIndex(playList, song)
  if (pIndex > -1) {
    if (isPlay) {
      insertIndex = pIndex
    }
  } else {
    songList.push(song)
    playList.push(song)
    if (isPlay) {
      insertIndex = songList.length - 1
    }
    store.dispatch(setSongList({ songList: songList }))
    store.dispatch(setPlayList({ playList: playList }))
  }
  if (insertIndex !== store.getState().playReducer.currentIndex) {
    store.dispatch(setCurrentIndex({ currentIndex: insertIndex }))
  }
}

export const insertSongs = (songs: Song[]) => {
  const songList = store.getState().playReducer.songList.slice()
  const playList = store.getState().playReducer.playList.slice()
  songs.forEach(item => {
    const pIndex = findIndex(playList, item)
    if (pIndex === -1) {
      songList.push(item)
      playList.push(item)
    }
  })
  store.dispatch(setSongList({ songList: songList }))
  store.dispatch(setPlayList({ playList: playList }))
}

export const controlModal = (modalVisible = true, modalType = ModalTypes.Default) => {
  store.dispatch(setModalType({ modalType: modalType }))
  store.dispatch(setModalVisible({ modalVisible: modalVisible }))
}