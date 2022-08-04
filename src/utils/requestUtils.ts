import { AxiosError, AxiosResponse } from "axios";
import { BaseResponse } from "../types/GlobalTypes";
import { API } from "./api";

export async function get<T>(url: string, params: any): Promise<BaseResponse & T> {
  const res = await API.get(url, { params }).then((resp: AxiosResponse) => {
    //console.log('resp', resp.status, resp.data)
    return resp.data
  }).catch((err: AxiosError) => {
    //console.log('err', err.response, err.response?.status, err.response?.data)
    //if you want to handle error,you can do it here.
    return err.response?.data
  })
  return res
}