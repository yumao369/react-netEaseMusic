
import { ValueForm } from "../components/wyUi/wyLayer/wyLayerLogin";
import { User } from "../types/GlobalTypes";
import { API } from "../utils/api";

export const login = async (values: ValueForm): Promise<User> => {
  const params = { phone: values.phoneNumber, password: values.password }
  const res = await API.get('/login/cellphone', { params })
  console.log(res.data)
  return res.data
}