import { Singer, SingerDetail } from "../types/GlobalTypes"
import { API } from "../utils/api"

export const getSingerDetail = async (id: string): Promise<SingerDetail> => {
  const params = { id: id }
  const res = await API.get("/artists", { params })
  const data = res.data
  return data
}

export const getSimilarSinger = async (id: string): Promise<Singer[]> => {
  const params = { id: id }
  const res = await API.get("/simi/artist", { params })
  const data = res.data.artists
  return data
}