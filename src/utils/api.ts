import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "./url";

const API = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});


/**
 * look at the article below to understand how to use interceptors
 * with ts.
 * https://dev.to/charlintosh/setting-up-axios-interceptors-react-js-typescript-12k5
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

API.interceptors.response.use(onResponse, onResponseError)

export { API };
