import { SongSheet } from "../types/GlobalTypes";
import { API } from "../utils/api";

export const getSongSheetDetail = async (id: number): Promise<SongSheet | undefined> => {
  const params = { id: id.toString() }
  const res = API.get('playlist/detail', { params })
  const { code, playlist } = (await res).data
  if (code === 200) {
    return playlist
  }
}