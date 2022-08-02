import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SingleSheet from "../../../components/wyUi/singleSheet";
import { AppContext } from "../../../context/appContext";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentSong } from "../../../redux/playerSlice";
import { insertSong, onPlaySheetBatch } from "../../../services/batchAction.service";
import { getUserDetail, getUserRecord, getUserSheets, RecordType } from "../../../services/member.service";
import { getSongList } from "../../../services/song.service";
import { recordVal, Song, User, UserSheet } from "../../../types/GlobalTypes";
import { findIndex } from "../../../utils/array";
import MyRecords from "../components/myRecords";
import styles from "./index.module.less"

export default function MyCenter() {
  const { uid } = useContext(AppContext)

  const history = useHistory()

  const [user, setUser] = useState<User | null>(null)
  const [userRecord, setUserRecord] = useState<recordVal[]>([])
  const [userSheet, setUserSheet] = useState<UserSheet | null>(null)
  const [recordType, setRecordType] = useState<RecordType>(RecordType.weekData)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const currentSong = useAppSelector(selectCurrentSong)

  useEffect(() => {
    getUDetail()
    getUSheets()
  }, [])

  useEffect(() => {
    getURecord()
  }, [recordType])

  useEffect(() => {
    listenCurrent()
  }, [currentSong, userRecord])

  const getUDetail = async () => {
    if (uid) {
      const user = await getUserDetail(uid)
      setUser(user)
    }
  }

  const getURecord = async () => {
    if (uid) {
      const record = await getUserRecord(uid, recordType)
      setUserRecord(record.slice(0, 10))
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

  const handleTypeChange = (type: RecordType) => {
    setRecordType(type)
  }

  const listenCurrent = () => {
    if (currentSong) {
      const songs = userRecord.map(item => item.song)
      const index = findIndex(songs, currentSong)
      console.log('index', index)
      setCurrentIndex(index)
    }
  }

  const addSongToList = async (song: Song, isPlay = false) => {
    console.log('song', song)
    if (!currentSong || currentSong.id !== song.id) {
      const list = await getSongList(song)
      if (list.length) {
        insertSong(list[0], isPlay)
      }
    }
  }

  const handleMoreRouteJump = (id: string | null | undefined) => {
    if (uid) {
      history.push(`/records/${id}`)
    }
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

        <MyRecords records={userRecord} recordType={recordType} listenSongs={user?.listenSongs} handleTypeChange={handleTypeChange} currentIndex={currentIndex} addSongToList={addSongToList} />
        {/**
         * problem:
         * 到这一页，一定是用户已经登录，本地存储了uid，所以uid一定是有值的，一定为number类型。
         * 而目前，uid的类型还是number|null|undefined类型，这导致在这种用户必须登录访问的页面，
         * 我们还需要判断uid是否存在，判断uid的类型，导致代码冗余，因为这些判断在进入这一页之前就
         * 已经判断好了，所以我认为从这一页再进行跳转的页面不应该再去判断uid是否存在或者判断uid的
         * 类型。
         * status:
         * NOT SOLVED
         * 
         */}
        <a className={styles.lookMore} onClick={() => { handleMoreRouteJump(uid) }}>查看更多&gt;</a>

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