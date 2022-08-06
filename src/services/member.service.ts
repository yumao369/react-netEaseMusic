
import { AxiosError, AxiosResponse } from "axios";
import { ValueForm } from "../components/wyUi/wyLayer/wyLayerLogin";
import { BaseResponse, AnyJson, User, Signin, recordVal, UserSheet, SongSheet, LikeSongParams, CreateSheetResponse } from "../types/GlobalTypes";
import { API } from "../utils/api";
import { get } from "../utils/requestUtils";

export enum RecordType {
  allData,
  weekData
}

export type ShareParams = {
  id: string;
  msg: string;
  type: string;
}

export enum LikeSingerType {
  sub = 1,
  unsub = 2
}

/**
 * problem:
 * Need to unify the processing logic of axios and add baseresponse
 * status:
 * NOT SOLVED
 */

export const login = async (values: ValueForm): Promise<User & BaseResponse> => {
  const params = { phone: values.phoneNumber, password: values.password }
  const res = await API.get('/login/cellphone', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}

export const getUserDetail = async (uid: string): Promise<User> => {
  const params = { uid: uid }
  const res = await API.get('/user/detail', { params })
  return res.data
}

export const getUserRecord = async (uid: string, type = RecordType.weekData): Promise<recordVal[]> => {
  const params = { uid: uid, type: type }
  const res = await API.get('/user/record', { params })
  return res.data[RecordType[type]]
}

export const getUserSheets = async (uid: string): Promise<UserSheet> => {
  const params = { uid: uid }
  const res = await API.get('/user/playlist', { params })
  const playList: SongSheet[] = res.data.playlist
  return {
    self: playList.filter(item => !item.subscribed),
    subscribed: playList.filter(item => item.subscribed)
  }

}

export const logout = async (): Promise<AnyJson & BaseResponse> => {
  const res = await API.get('/logout')
  return res.data
}

/**
 * problem:
 * code below can be encapsulated as a function to handle axios request.
 * status:
 * NOT SOLVED
 */
export const signin = async (): Promise<Signin & BaseResponse> => {
  const params = { type: 1 }
  const res = await API.get('/daily_signin', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}

/**
 * 
 * export const addLikeSong = async ({ pid, tracks }: LikeSongParams): Promise<BaseResponse> => {
  const params = { pid, tracks, op: 'add' }
  const res = await API.get('/playlist/tracks', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}
 */

/**
 * export const createSheet = async (name: string): Promise<CreateSheetResponse & BaseResponse> => {
  const params = { name: name }
  const res = await API.get('/playlist/create', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}
 */

/**
 * export const likeSheet = async (id: string, t = 1): Promise<BaseResponse> => {
  const params = { id, t }
  const res = await API.get('/playlist/subscribe', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}
 */

export const addLikeSong = <T>({ pid, tracks }: LikeSongParams) => {
  return get<T>('/playlist/tracks', { pid, tracks })
}

export const createSheet = <T>(name: string) => {
  return get<T>('/playlist/create', { name })
}

export const likeSheet = <T>(id: string, t = 1) => {
  return get<T>('/playlist/subscribe', { id, t })
}

export const shareResource = <T>({ id, msg, type }: ShareParams) => {
  return get<T>('share/resource', { id, msg, type })
}

export const likeSinger = <T>(id: string, t: LikeSingerType) => {
  return get<T>('artist/sub', { id, t })
}
