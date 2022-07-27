import { message } from "antd"
import React, { Children, createContext } from "react"
import { ValueForm } from "../components/wyUi/wyLayer/wyLayerLogin"
import { login, logout } from "../services/member.service"
import { useLocalStorage } from "../utils/hooks"

interface AppContextProviderProps {
  children: React.ReactNode
}

interface AppContextValue {
  onLogin?: (loginParams: ValueForm) => Promise<void>
  onLogOut?: () => Promise<void>
  uid?: string | null
  loginInfo?: string | null
}

const defeaultValue = {}

export const AppContext = createContext<AppContextValue>(defeaultValue)

export const AppContextProvider = (props: AppContextProviderProps) => {

  /**
   * problem:react does not rerender when localstorage changes
   * 
   * solutions:
   * we need to set a state to trigger rerender after localstorage
   * value changes.Look at the article below.
   * https://javascript.plainenglish.io/connecting-react-with-localstorage-ad590d4e4fa1#:~:text=React%20does%20not%20rerender%20when,by%20updating%20an%20unused%20state.
   */

  const { value: uid, updatedSetValue: setUid } = useLocalStorage('wyUserId')
  const { value: loginInfo, updatedSetValue: setLoginInfo } = useLocalStorage('wyRememberLogin')

  const onLogin = async (loginParams: ValueForm) => {
    const user = await login(loginParams)
    if (user.code !== 200) {
      message.warn(`${user.message || '登录失败'}`)
    } else {
      message.success('登录成功')
      //localStorage.setItem('wyUserId', user.profile.userId.toString())
      setUid(user.profile.userId.toString())
      if (loginParams.remember) {
        //localStorage.setItem('wyRememberLogin', JSON.stringify(loginParams))
        setLoginInfo(JSON.stringify(loginParams))
      } else {
        //localStorage.removeItem('wyRememberLogin')
        setLoginInfo(null)
      }
    }
  }

  const onLogOut = async () => {
    const data = await logout()
    console.log('data', data)
    if (data.code === 200) {
      //localStorage.removeItem('wyUserId')
      setUid(null)
      message.success('登出成功')
    } else {
      message.warn(`${data.message || '登出失败'}`)
    }
  }


  return (
    <AppContext.Provider value={{ onLogin: onLogin, onLogOut: onLogOut, uid, loginInfo }}>
      {props.children}
    </AppContext.Provider>
  )
}