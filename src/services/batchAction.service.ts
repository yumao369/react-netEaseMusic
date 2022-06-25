import { playsheet } from "./sheet.service";
import store from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import { setCurrentIndex, setPlayList, setSongList } from "../redux/playerSlice"

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