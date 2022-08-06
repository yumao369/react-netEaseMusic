import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setShareInfo } from "../../../redux/memberSlice";
import { selectCurrentSong } from "../../../redux/playerSlice";
import { insertSong, likeSong } from "../../../services/batchAction.service";
import { getUserDetail, getUserRecord, RecordType } from "../../../services/member.service";
import { getSongList } from "../../../services/song.service";
import { recordVal, Singer, Song, User } from "../../../types/GlobalTypes";
import { findIndex } from "../../../utils/array";
import MyRecords from "../components/myRecords";
import styles from "./index.module.less"

export default function RecordDetail() {
  const { uid } = useContext(AppContext)

  const [user, setUser] = useState<User | null>(null)
  const [userRecord, setUserRecord] = useState<recordVal[]>([])
  const [recordType, setRecordType] = useState<RecordType>(RecordType.weekData)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const currentSong = useAppSelector(selectCurrentSong)

  const dispatch = useAppDispatch()

  useEffect(() => {
    getUDetail()
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
      setUserRecord(record)
    }
  }

  const handleTypeChange = (type: RecordType) => {
    setRecordType(type)
  }

  const listenCurrent = () => {
    console.log('currentsong', currentSong)
    if (currentSong) {
      console.log('userRecord', userRecord)
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

  /**
   * 问题：
   * 分享和收藏这两个功能在sheetInfo,player,playerPanel,songInfo,record,singerDetail几个组件中都有，
   * 并且逻辑都差不多，所以这段逻辑最好分装成一段代码，在需要的地方调用即可。
   * status:
   * NOT SOLVED
   */

  const handleLikeSong = (id: string) => {
    likeSong(id)
  }

  const handleShareSong = (resource: Song, type = 'song') => {
    const txt = makeTxt('歌曲', resource.name, resource.ar)
    dispatch(setShareInfo({ shareInfo: { id: resource.id.toString(), type, txt } }))
  }

  const makeTxt = (type: string, name: string, makeBy: Singer[]): string => {
    const makeByStr = makeBy.map(item => item.name).join('/')
    return `${type}: ${name} -- ${makeByStr}`
  }

  return (
    <div className={[styles.recordDetail, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.pageWrap}>
        <MyRecords
          records={userRecord}
          recordType={recordType}
          listenSongs={user?.listenSongs}
          handleTypeChange={handleTypeChange}
          currentIndex={currentIndex}
          addSongToList={addSongToList}
          onLikeSong={handleLikeSong}
          onShareSong={handleShareSong}
        />
      </div>
    </div>
  )
}