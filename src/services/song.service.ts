import { Song, SongUrl } from "../types/GlobalTypes";
import { API } from "../utils/api";

export const getSongUrl = async (ids: string): Promise<SongUrl[]> => {
  const params = { id: ids };
  const res = await API.get("song/url", { params });
  const { data } = res.data;
  return data;
};

export const getSongList = async (songs: Song | Song[]): Promise<Song[]> => {
  const songArr = Array.isArray(songs) ? songs.slice() : [songs];
  const ids = songArr.map((item) => item.id).join(",");
  const urls = await getSongUrl(ids);
  const result = generateSongList(songArr, urls);
  return result;
};

const generateSongList = (songs: Song[], urls: SongUrl[]): Song[] => {
  const result: Song[] = [];
  songs.forEach((song) => {
    const url = urls.find((url) => url.id === song.id)?.url;
    if (url) {
      result.push({ ...song, url });
    }
  });
  return result;
};
