import { Button, message } from "antd";
import React from "react";
import { signin } from "../../../../services/member.service";
import { User } from "../../../../types/GlobalTypes";
import styles from "./index.module.less";

interface MemberCardProps {
  openModal: () => void;
  user: User | null
}

export default function MemberCard(props: MemberCardProps) {

  const handleSignIn = async () => {
    const res = await signin()
    if (res.code === 200) {
      message.success('签到成功')
    } else {
      message.error(`${res.msg || '签到失败'}`)
    }
  }

  return (
    <div>
      {
        props.user ? (
          <div className={styles.nMyinfo}>
            <div className={[styles.fCb, 'clearfix'].join(' ')}>
              <div className={styles.head}>
                <img src={props.user.profile.avatarUrl} alt={props.user.profile.nickname} />
              </div>
              <div className={styles.info}>
                <h4><a className="ellipsis">{props.user.profile.nickname}</a></h4>
                <p className={styles.lv}>
                  <span className={[styles.uLv, styles.uIcn2].join(' ')}>
                    {props.user.level}
                    <i className={[styles.lvright, styles.uIcn2].join(' ')}></i>
                  </span>
                </p>
                <div className={styles.fPr}>
                  <Button type="primary" block onClick={handleSignIn}>签到</Button>
                </div>
              </div>
            </div>

            <ul className={[styles.dny, "clearfix"].join(' ')}>
              <li className={styles.fst}>
                <strong className="ellipsis">{props.user.profile.eventCount}</strong>
                <span>动态</span>
              </li>
              <li>
                <strong className="ellipsis">{props.user.profile.follows}</strong>
                <span>关注</span>
              </li>
              <li className={styles.lst}>
                <strong className="ellipsis">{props.user.profile.followeds}</strong>
                <span>粉丝</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className={styles.member}>
            <div className={styles.login}>
              <p className={styles.annotation}>
                登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机
              </p>
              <Button className={styles.btn} onClick={props.openModal}>用户登录</Button>
            </div>
          </div>
        )
      }
    </div >
  );
}
