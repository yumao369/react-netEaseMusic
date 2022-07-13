import React from "react"; console
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Button, Checkbox, Input } from "antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { ModalTypes, setModalType } from "../../../../redux/memberSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import { withFormik, FormikProps, FormikErrors, Field } from 'formik';

interface FormValues {
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
        <Input prefix={<MobileOutlined />} />
      </FormItem>
      <FormItem validateStatus={touched.password && errors.password ? "error" : ""} help={errors.password} hasFeedback>
        <Input.Password prefix={<LockOutlined />} />
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
})(InnerForm)

export default function WyLayerLogin() {

  const dispatch = useAppDispatch()

  const changeModalType = (modalType: ModalTypes) => {
    dispatch(setModalType({ modalType: modalType }))
  }

  return (
    <div>
      <div className="login-phone modal-content">
        <div className="modal-wrap">
          <MyForm />
        </div>
      </div>

      <div className={[styles.mFooter, 'clearfix'].join(' ')}>
        <a onClick={() => { changeModalType(ModalTypes.Default) }}>其他登录方式</a>
        <a onClick={() => { changeModalType(ModalTypes.Register) }}>没有账号？免费注册</a>
      </div>
    </div>
  )
}