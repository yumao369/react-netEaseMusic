import { Song, SongSheet } from "../types/GlobalTypes";
import { API } from "../utils/api";
import { getSongList } from "./song.service";

export const getSongSheetDetail = async (id: number): Promise<SongSheet> => {
  const params = { id: id.toString() };
  const res = await API.get("playlist/detail", { params });
  const { playlist } = res.data;
  return playlist;
};

export const playsheet = async (id: number): Promise<Song[]> => {
  const songSheetDetail = await getSongSheetDetail(id);
  const tracks = songSheetDetail.tracks;
  const playsheet = getSongList(tracks);
  console.log("playsheet", playsheet);
  return playsheet;
};
