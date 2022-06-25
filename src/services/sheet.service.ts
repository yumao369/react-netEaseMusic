import { SheetList, SheetParams, Song, SongSheet } from "../types/GlobalTypes";
import { API } from "../utils/api";
import { getSongList } from "./song.service";
//import queryString from 'query-string'

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
  return playsheet;
};

export const getSheets = async (args: SheetParams): Promise<SheetList> => {
  //const params = { fromString: queryString.stringify(args) }
  const params = args
  const res = await API.get("top/playlist", { params })
  const { playlists, total } = res.data
  return { playlists, total }
}
