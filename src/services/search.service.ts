import { SearchResult } from "../types/GlobalTypes"
import { API } from "../utils/api"

export const search = async (keywords: string): Promise<SearchResult> => {
  const params = { keywords: keywords }
  const res = await API.get("/search/suggest", { params })
  const data = res.data.result
  return data
}