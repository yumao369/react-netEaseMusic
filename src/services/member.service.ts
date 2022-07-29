
import { AxiosError, AxiosResponse } from "axios";
import { ValueForm } from "../components/wyUi/wyLayer/wyLayerLogin";
import { BaseResponse, AnyJson, User, Signin } from "../types/GlobalTypes";
import { API } from "../utils/api";

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

export const logout = async (): Promise<AnyJson & BaseResponse> => {
  const res = await API.get('/logout')
  return res.data
}

export const signin = async (): Promise<Signin & BaseResponse> => {
  const params = { type: 1 }
  const res = await API.get('/daily_signin', { params }).then((resp: AxiosResponse) => {
    return resp.data
  }).catch((err: AxiosError) => {
    return err.response?.data
  })
  return res
}