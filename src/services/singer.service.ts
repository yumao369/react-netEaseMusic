import { SingerDetail } from "../types/GlobalTypes"
import { API } from "../utils/api"

export const getSingerDetail = async (id: string): Promise<SingerDetail> => {
  const params = { id: id }
  const res = await API.get("/artists", { params })
  const data = res.data
  return data
}