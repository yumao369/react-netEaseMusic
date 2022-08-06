import React, { useContext, useEffect, useRef, useState } from "react";
//import Form from "antd/lib/form/Form";
//import FormItem from "antd/lib/form/FormItem";
//import { Button, Checkbox, Input } from "antd";
import { Formik, FormikValues } from "formik"
import {
  SubmitButton,
  Input,
  Checkbox,
  ResetButton,
  FormikDebug,
  Form,
  FormItem,
} from "formik-antd"
import { Button } from "antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { ModalTypes, setModalType } from "../../../../redux/memberSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import { withFormik, FormikProps, FormikErrors, Field } from 'formik';
import { message } from "antd";
import { login } from "../../../../services/member.service";
import { controlModal } from "../../../../services/batchAction.service";
import { AppContext } from "../../../../context/appContext";
import { decodeBase64 } from "../../../../utils/base64";
import { AnyJson } from "../../../../types/GlobalTypes";

/*interface FormValues {
  phoneNumber: string;
  password: string;
}


const InnerForm = (props: FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting } = props
  console.log('errors', errors)
  return (
    <Form>
      <FormItem>
        <Input />
      </FormItem>
      <FormItem validateStatus={touched.phoneNumber && errors.phoneNumber ? "error" : ""} help={errors.phoneNumber} hasFeedback>
        <Input name="phoneNumber" prefix={<MobileOutlined />} />
      </FormItem>
      <FormItem validateStatus={touched.password && errors.password ? "error" : ""} help={errors.password} hasFeedback>
        <Input.Password name="password" prefix={<LockOutlined />} />
      </FormItem>
      <FormItem>

        <Checkbox>记住密码</Checkbox>
        <Button type='primary' block={true} className={styles.login} disabled={isSubmitting}>登陆</Button>
      </FormItem>
    </Form>
  )
}

interface MyFormProps {
  initialPhoneNumber?: string;
  initialPassword?: string;
}

const MyForm = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: props => {
    return {
      phoneNumber: props.initialPhoneNumber ?? '',
      password: props.initialPassword ?? ''
    }
  },
  validate: (values: FormValues) => {
    console.log(values)
    let errors: FormikErrors<FormValues> = {}
    if (!/^1\d{10}$/.test(values.phoneNumber)) {
      console.log('xxxxx')
      errors.phoneNumber = '请输入正确的手机号'
    }
    if (values.password.length < 6) {
      errors.password = '请输入正确的密码'
    }
    console.log(errors)
    return errors
  },
  handleSubmit: values => {

  }
})(InnerForm)*/
export interface ValueForm {
  phoneNumber: string;
  password: string;
  remember: boolean;
}
interface ErrorForm {
  phoneNumber?: string;
  password?: string;
  remember?: boolean
}

const MyFormTwo = () => {

  const { onLogin, loginInfo } = useContext(AppContext)

  const initValues = (): ValueForm => {
    if (loginInfo) {
      const value = decodeBase64(JSON.parse(loginInfo))
      console.log(value.phoneNumber)
      return {
        phoneNumber: value.phoneNumber,
        password: value.password,
        remember: value.remember
      }
    } else {
      return {
        phoneNumber: '',
        password: '',
        remember: false
      }
    }
  }
  const handleSubmit = async (value: FormikValues) => {
    console.log(value)
    //console.log({ ...value, remember })
    const loginParams: ValueForm = {
      phoneNumber: value.phoneNumber,
      password: value.password,
      remember: value.remember
    }
    //if user don't exist,the user 
    /*const user = await login(loginParams)
    console.log('user', user)
    //store user ID in memory
    if (user.code !== 200) {
      message.warn(`${user.message || '登录失败'}`)
    } else {
      message.success('登录成功')
      localStorage.setItem('wyUserId', user.profile.userId.toString())

      if (loginParams.remember) {
        localStorage.setItem('wyRememberLogin', JSON.stringify(loginParams))
      } else {
        localStorage.removeItem('wyRememberLogin')
      }
    }*/

    if (onLogin) {
      onLogin(loginParams)
    }

    controlModal(false)

  }
  return (
    <Formik
      initialValues={initValues()}
      onSubmit={(values, actions) => {

        actions.setSubmitting(false)
        handleSubmit(values)
      }}
      validate={values => {
        const errors: ErrorForm = {}
        if (!/^1\d{10}$/.test(values.phoneNumber)) {
          errors.phoneNumber = '请输入正确的手机号'
        }
        if (values.password.length < 6) {
          errors.password = '请输入正确的密码'
        }
        return errors
      }}
    >
      {/**
       * problem:
       * there is still a problem with the logic of error display.
       * status:
       * NOT SOLVED
       */}
      {({ errors, touched }) => {
        console.log(errors, touched)
        return (
          <Form >
            <FormItem name="phoneNumber" hasFeedback>
              <Input name="phoneNumber" prefix={<MobileOutlined />} />
            </FormItem>
            <FormItem name="password" hasFeedback>
              <Input.Password name="password" prefix={<LockOutlined />} />
            </FormItem>
            <FormItem name='remember'>

              <Checkbox name="remember" >记住密码</Checkbox>
              <SubmitButton type='primary' block={true} className={styles.login} >登陆</SubmitButton>
            </FormItem>

          </Form>
        )
      }}
    </Formik >
  )
}

export default function WyLayerLogin() {

  const dispatch = useAppDispatch()

  const changeModalType = (modalType: ModalTypes) => {
    dispatch(setModalType({ modalType: modalType }))
  }

  return (
    <div>
      <div className="login-phone modal-content">
        <div className="modal-wrap">
          <MyFormTwo />
        </div>
      </div>

      <div className={[styles.mFooter, 'clearfix'].join(' ')}>
        <a onClick={() => { changeModalType(ModalTypes.Default) }}>其他登录方式</a>
        <a onClick={() => { changeModalType(ModalTypes.Register) }}>没有账号？免费注册</a>
      </div>
    </div>
  )
}