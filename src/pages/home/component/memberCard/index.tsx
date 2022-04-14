import { Button } from "antd";
import React from "react";
import styles from "./index.module.less"

export default function MemberCard() {
  return (
    <div className={styles.member}>
      <div className={styles.login}>
        <p className={styles.annotation}>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
        <Button className={styles.btn}>用户登录</Button>
      </div>
    </div>
  )
}