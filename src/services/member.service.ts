
import { ValueForm } from "../components/wyUi/wyLayer/wyLayerLogin";
import { BaseResponse, logOutResp, User } from "../types/GlobalTypes";
import { API } from "../utils/api";

export const login = async (values: ValueForm): Promise<User & BaseResponse> => {
  const params = { phone: values.phoneNumber, password: values.password }
  const res = await API.get('/login/cellphone', { params })
  return res.data
}

export const getUserDetail = async (uid: string): Promise<User> => {
  const params = { uid: uid }
  const res = await API.get('/user/detail', { params })
  return res.data
}

export const logout = async (): Promise<logOutResp & BaseResponse> => {
  const res = await API.get('/logout')
  return res.data
}