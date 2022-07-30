import React, { useContext, useEffect, useState } from "react";
import SingleSheet from "../../../components/wyUi/singleSheet";
import { AppContext } from "../../../context/appContext";
import { onPlaySheetBatch } from "../../../services/batchAction.service";
import { getUserDetail, getUserRecord, getUserSheets, RecordType } from "../../../services/member.service";
import { recordVal, User, UserSheet } from "../../../types/GlobalTypes";
import MyRecords from "../components/myRecords";
import styles from "./index.module.less"

export default function MyCenter() {

  const recordType = RecordType.weekDtate

  const { uid } = useContext(AppContext)

  const [user, setUser] = useState<User | null>(null)
  const [userRecord, setUserRecord] = useState<recordVal[]>([])
  const [userSheet, setUserSheet] = useState<UserSheet | null>(null)

  useEffect(() => {
    getUDetail()
    getURecord()
    getUSheets()
  }, [])

  const getUDetail = async () => {
    if (uid) {
      const user = await getUserDetail(uid)
      setUser(user)
    }
  }

  const getURecord = async () => {
    if (uid) {
      const record = await getUserRecord(uid)
      setUserRecord(record)
    }
  }

  const getUSheets = async () => {
    if (uid) {
      const sheets = await getUserSheets(uid)
      setUserSheet(sheets)
    }
  }

  const onPlaySheet = (id: number) => {
    onPlaySheetBatch(id)
  }

  const renderMyCreate = () => {
    return userSheet?.self.map(item => {
      return (
        <SingleSheet className={styles.sheetItem} sheet={item} onPlay={onPlaySheet} key={item.id} />
      )
    })
  }

  const renderMySubscribed = () => {
    return userSheet?.subscribed.map(item => {
      return (
        <SingleSheet className={styles.sheetItem} sheet={item} onPlay={onPlaySheet} key={item.id} />
      )
    })
  }

  return (
    < div className={[styles.userCenter, 'wrap', 'feature-wrap'].join(' ')} >
      <div className={styles.pageWrap}>
        <div className={[styles.mProifo, 'clearfix'].join(' ')}>
          <div className={styles.fPr}>
            <img src={user?.profile.avatarUrl} alt={user?.profile.nickname} />
          </div>
          <div className={styles.fR}>

            <div className={styles.name}>
              <h2 className="clearfix">
                <span className={[styles.tit, 'ellipsis'].join(' ')}>{user?.profile.nickname}</span>
                <p className={styles.lv}>
                  <span className={[styles.uLv, styles.uIcn2].join(' ')}>
                    {user?.level}
                    <i className={[styles.lvright, styles.uIcn2].join(' ')}></i>
                  </span>
                </p>
                <div className={styles.icnGender}></div>
              </h2>
            </div>

            <ul className={[styles.dny, 'clearfix'].join(' ')}>
              <li className={styles.fst}>
                <strong className="ellipsis">{user?.profile.eventCount}</strong>
                <span>动态</span>
              </li>
              <li>
                <strong className="ellipsis">{user?.profile.follows}</strong>
                <span>关注</span>
              </li>
              <li className={styles.lst}>
                <strong className="ellipsis">{user?.profile.followeds}</strong>
                <span>粉丝</span>
              </li>
            </ul>

            <div className={[styles.inf, 'f-brk'].join(' ')}>{user?.profile.signature}</div>
          </div>
        </div>

        <MyRecords records={userRecord} recordType={recordType} listenSongs={user?.listenSongs} />

        <div className={['wy-sec', styles.sheets].join(' ')}>
          <div className="u-title wy-sec-wrap clearfix">
            <h3 className="wy-sec-tit">
              <span className="f-ff2">我创建的歌单</span>
              <span className="sub s-fc3">{userSheet?.self.length}</span>
            </h3>
          </div>

          <div className={[styles.sheetList, 'clearfix'].join(' ')}>
            {renderMyCreate()}
          </div>
        </div >

        <div className="wy-sec sheets">
          <div className="u-title wy-sec-wrap clearfix">
            <h3 className="wy-sec-tit">
              <span className="f-ff2">我收藏的歌单</span>
              <span className="sub s-fc3">{userSheet?.subscribed.length}</span>
            </h3>
          </div>

          <div className={[styles.sheetList, 'clearfix'].join(' ')}>
            {renderMySubscribed()}
          </div>
        </div >
      </div >
    </div >
  )
}