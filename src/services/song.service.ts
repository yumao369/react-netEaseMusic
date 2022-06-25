import { Lyric, Song, SongUrl } from "../types/GlobalTypes";
import { API } from "../utils/api";
import { get } from "../utils/requestUtils";

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

export const getLyric = async (id: number): Promise<Lyric> => {
  const params = { id: id }
  const res = await API.get("lyric", { params })
  const { data } = res
  return {
    lyric: data.lrc?.lyric ?? '',
    tlyric: data.tlyric?.lyric ?? ''
  }
}

/*export const getLyric = <T>(id: number) => {
  return get<T>("lyric", { id: id })
}*/
