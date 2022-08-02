import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentSong } from "../../../redux/playerSlice";
import { insertSong } from "../../../services/batchAction.service";
import { getUserDetail, getUserRecord, RecordType } from "../../../services/member.service";
import { getSongList } from "../../../services/song.service";
import { recordVal, Song, User } from "../../../types/GlobalTypes";
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

  return (
    <div className={[styles.recordDetail, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.pageWrap}>
        <MyRecords records={userRecord} recordType={recordType} listenSongs={user?.listenSongs} handleTypeChange={handleTypeChange} currentIndex={currentIndex} addSongToList={addSongToList} />
      </div>
    </div>
  )
}