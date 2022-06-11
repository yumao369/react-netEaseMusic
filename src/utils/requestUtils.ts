import { API } from "./api";

export async function get<T>(url: string, params: any): Promise<[number, T]> {
  const res = await API.get(url, { params })
  return [res.status, res.data]
}