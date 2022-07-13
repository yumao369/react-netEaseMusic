import React from "react"; console
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Button, Checkbox, Input } from "antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { ModalTypes, setModalType } from "../../../../redux/memberSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import { useFormik } from 'formik';

export default function WyLayerLogin() {

  const dispatch = useAppDispatch()

  const changeModalType = (modalType: ModalTypes) => {
    dispatch(setModalType({ modalType: modalType }))
  }

  return (
    <div>
      <div className="login-phone modal-content">
        <div className="modal-wrap">
          <Form>
            <FormItem >
              <Input prefix={<MobileOutlined />} />
            </FormItem>
            <FormItem>
              <Input.Password prefix={<LockOutlined />} />
            </FormItem>
            <FormItem>

              <Checkbox>记住密码</Checkbox>
              <Button type='primary' block={true} className={styles.login} disabled={true}>登陆</Button>
            </FormItem>
          </Form>
        </div>
      </div>

      <div className={[styles.mFooter, 'clearfix'].join(' ')}>
        <a onClick={() => { changeModalType(ModalTypes.Default) }}>其他登录方式</a>
        <a onClick={() => { changeModalType(ModalTypes.Register) }}>没有账号？免费注册</a>
      </div>
    </div>
  )
}