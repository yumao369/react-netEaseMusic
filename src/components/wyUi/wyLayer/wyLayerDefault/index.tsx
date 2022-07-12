import { Button } from "antd";
import React from "react";
import platForm from "../../../../assets/images/platform.png"
import { useAppDispatch } from "../../../../redux/hooks";
import { ModalTypes, setModalType } from "../../../../redux/memberSlice";
import styles from "./index.module.less"

export default function WyLayerDefault() {
  const dispatch = useAppDispatch()

  const handleLogin = () => {
    dispatch(setModalType({ modalType: ModalTypes.LoginByPhone }))
  }

  const handleRegister = () => {
    dispatch(setModalType({ modalType: ModalTypes.Register }))
  }

  return (
    <div className={styles.cnzt}>
      <div className={styles.selectLog}>
        <div className={styles.midWrap}>
          <div className={styles.pic}>
            <img src={platForm} />
          </div>
          <div className={styles.methods}>
            <Button size="large" type="primary" block={true} onClick={handleLogin}>手机号登录</Button>
            <Button size="large" type="primary" block={true} onClick={handleRegister}>注册</Button>
          </div>
        </div>
      </div>
    </div>
  )
}