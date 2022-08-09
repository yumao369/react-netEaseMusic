import { Form, message } from "antd";
import { Formik, FormikProps } from "formik";
import { FormItem, Input, SubmitButton } from "formik-antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import * as Yup from 'yup';
import styles from "./index.module.less"
import { useAppDispatch } from "../../../../redux/hooks";
import { ModalTypes, setModalType } from "../../../../redux/memberSlice";
import { sendCode } from "../../../../services/member.service";
import { interval, Subscription } from "rxjs";
import { take } from "rxjs/internal/operators";
import { useEffect, useRef, useState } from "react";
import WyCheckCode from "../wyCheckCode";

export interface RegisterFormValue {
  phoneNumber: string,
  password: string
}

interface MyFormProps {
  showCodeOnceSubmit: () => void;
  changePhoneOnceSubmit: (phone: string) => void
}

//always remember to move const out of component
const MIN_PASSWORD = 6
const defaultTiming = 60

const MyForm = (props: MyFormProps) => {
  const initialValues: RegisterFormValue = { phoneNumber: '', password: '' }

  const [timing, setTiming] = useState<number>(defaultTiming)
  const intervalRef = useRef<null | Subscription>(null)

  const handleSendCodeRespSuccess = () => {
    if (intervalRef.current) {
      intervalRef.current.unsubscribe()
      return
    }
    const subscription = interval(1000).pipe(take(60)).subscribe((prev) => { setTiming(prev - 1) })
    intervalRef.current = subscription
  }


  const sendCodeOnceSubmit = async (phone: number) => {
    const res = await sendCode(phone)
    if (res.code !== 200) {
      message.error(`${res.message}`)
    } else {
      //interval$.pipe(take(60)).subscribe(() => setTiming(timing - 1))
      props.showCodeOnceSubmit()
      handleSendCodeRespSuccess()
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        phoneNumber: Yup.string()
          .matches(/^1\d{10}$/, '请输入正确的手机号'),
        password: Yup.string()
          .min(MIN_PASSWORD, '请输入六位及以上字符')
      })}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false)
        props.changePhoneOnceSubmit(values.phoneNumber)
        sendCodeOnceSubmit(Number(values.phoneNumber))
      }}
    >
      {(props: FormikProps<RegisterFormValue>) => {
        console.log(props.isValid)
        return (
          <Form>
            <FormItem name='phoneNumber' >
              <label>手机号</label>
              <Input name="phoneNumber" prefix={<MobileOutlined />} />
            </FormItem>
            <FormItem name='password' >
              <label>密码</label>
              <Input.Password name='password' prefix={<LockOutlined />} />
            </FormItem>
            <SubmitButton type="default" block={true} onClick={() => { props.handleSubmit() }}>下一步</SubmitButton>
          </Form>
        )
      }}
    </Formik>
  )
}

export default function WyLayerRegister() {
  const dispatch = useAppDispatch()

  const [showCode, setShowCode] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')

  const changeModalType = (modalType: ModalTypes) => {
    setShowCode(false)
    dispatch(setModalType({ modalType: modalType }))
  }

  const showCodeOnceSubmit = () => {
    setShowCode(true)
  }

  const changePhoneOnceSubmit = (phone: string) => {
    setPhone(phone)
  }

  return (
    <div>
      <div className="login-phone modal-content">
        <div className="modal-wrap">
          {
            !showCode ? (
              <MyForm showCodeOnceSubmit={showCodeOnceSubmit} changePhoneOnceSubmit={changePhoneOnceSubmit} />
            ) : (
              <WyCheckCode phone={phone} />
            )
          }
        </div>
      </div>

      <div className={[styles.mFooter, 'clearfix'].join(' ')}>
        <a onClick={() => { changeModalType(ModalTypes.Default) }}>&lt;其他登录方式</a>
      </div>
    </div>
  )
}