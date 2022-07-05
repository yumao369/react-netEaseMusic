import React from "react";
import styles from "./index.module.less"

interface WyLayerModalProps {
  children: React.ReactNode
}

export default function WyLayerModal(props: WyLayerModalProps) {
  return (
    <div className={styles.mLayer}>
      <div className={styles.zbar}>
        <div className={styles.zttl}>这是标题</div>
      </div>
      {props.children}
      <div className={styles.zcls} title="关闭"></div>
    </div>
  )
}