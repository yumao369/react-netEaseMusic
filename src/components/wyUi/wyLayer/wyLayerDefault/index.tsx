import { Button } from "antd";
import React from "react";
import platForm from "../../../../assets/images/platform.png"
import styles from "./index.module.less"

export default function WyLayerDefault() {
  return (
    <div className={styles.cnzt}>
      <div className={styles.selectLog}>
        <div className={styles.midWrap}>
          <div className={styles.pic}>
            <img src={platForm} />
          </div>
          <div className={styles.methods}>
            <Button size="large" type="primary" block={true}>手机号登录</Button>
            <Button size="large" type="primary" block={true}>注册</Button>
          </div>
        </div>
      </div>
    </div>
  )
}