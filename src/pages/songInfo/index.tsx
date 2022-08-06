import React, { useEffect, useState } from "react";
import { PlayCircleOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { getLyric, getSongDetail, getSongList } from "../../services/song.service";
import { Control, Lyric, Singer, Song } from "../../types/GlobalTypes";
import { BaseLyricLine, WyLyric } from "../../components/wyUi/wyPlayer/wyPlayerPanel/lyric";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentSong } from "../../redux/playerSlice";
import { insertSong, likeSong } from "../../services/batchAction.service";
import { setShareInfo } from "../../redux/memberSlice";

interface SongInfoParams {
  id: string
}

export function SongInfo() {
  const params = useParams<SongInfoParams>()
  const initControlLyric: Control = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }

  const [songInfo, setSongInfo] = useState<Song | null>(null)
  const [lyric, setLyric] = useState<BaseLyricLine[] | null>(null)
  const [controlLyric, setControlLyric] = useState<Control>(initControlLyric)

  const currentSong = useAppSelector(selectCurrentSong)

  const dispatch = useAppDispatch()

  useEffect(() => {
    getSong()
    getSongLyric()
  }, [params])

  const getSong = async () => {
    const songInfo = await getSongDetail(params.id)
    setSongInfo(songInfo)
  }

  const getSongLyric = async () => {
    const res = await getLyric(Number(params.id))
    const lyric = new WyLyric(res)
    setLyric(lyric.lines)
  }

  const toggleLyric = () => {
    const isExpand = !controlLyric.isExpand
    const label = isExpand ? '收起' : '展开'
    const iconCls = isExpand ? 'up' : 'down'
    setControlLyric({ isExpand, label, iconCls })
  }

  const addSongToList = async (song: Song | null, isPlay = false) => {
    if (song) {
      if (!currentSong || currentSong.id !== song.id) {
        const list = await getSongList(song)
        if (list.length) {
          insertSong(list[0], isPlay)
        }
      }
    }
  }

  const handleLikeSongClick = (id: string | undefined) => {
    if (id) {
      likeSong(id)
    }
  }

  const handleShareSongClick = (resource: Song | null, type = 'song') => {
    if (resource) {
      const txt = makeTxt('歌曲', resource.name, resource.ar)
      dispatch(setShareInfo({ shareInfo: { id: resource.id.toString(), type, txt } }))
    }
  }

  const makeTxt = (type: string, name: string, makeBy: Singer[]): string => {
    const makeByStr = makeBy.map(item => item.name).join('/')
    return `${type}: ${name} -- ${makeByStr}`
  }

  const renderSingers = (singers: Singer[]) => {
    const length = singers.length
    return singers.map((item, index) => {
      return (
        <li key={item.id} className={styles.singer}>
          <a href={`//music.163.com/artist?id=${item.id}`} >{item.name}</a>
          <i hidden={index === length - 1}>/</i>
        </li>
      )
    })
  }

  const renderLyric = (lyric: BaseLyricLine[]) => {
    return lyric.map((item, index) => {
      return (
        <div className={styles.lyricLine} key={index}>
          <p>{item.txt}</p>
          <p>{item.txtCn}</p>
        </div>
      )
    })
  }

  return (
    <div className={[styles.songInfo, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.gWrap6}>
        <div className={[styles.mInfo, 'clearfix'].join(' ')}>
          <div className={styles.cover}>
            <img src={songInfo?.al.picUrl} alt={songInfo?.name} />
            <div className={styles.mask}></div>
          </div>
          <div className={styles.cnt}>
            <div className={styles.cntc}>
              <div className={[styles.hd, 'clearfix'].join(' ')}>
                <i className={styles.fPr}></i>
                <div className={styles.tit}>
                  <h2 className={[styles.fFf2, styles.fBrk].join(' ')}>{songInfo?.name}</h2>
                </div>
              </div>

              <div className={[styles.user, 'f-cb'].join(' ')}>
                <div className={[styles.singers, 'clearfix'].join(' ')}>
                  <span>歌手：</span>
                  <ul className="clearfix">
                    {renderSingers(songInfo?.ar ?? [])}
                  </ul>
                </div>

                <div className={styles.al}>
                  <span>所属专辑：</span>
                  <span className={styles.alName}>{songInfo?.al.name}</span>
                </div>
              </div>

              <div className={styles.btns}>
                <Button.Group className={styles.btn}>
                  <Button className={styles.play} type="primary" icon={<PlayCircleOutlined />} onClick={() => { addSongToList(songInfo, true) }}>
                    播放
                  </Button>
                  <Button className={styles.add} type="primary" onClick={() => { addSongToList(songInfo) }} >+</Button>
                </Button.Group>
                <Button className={[styles.btn, styles.like].join(' ')} onClick={() => { handleLikeSongClick(songInfo?.id.toString()) }}>
                  <span>收藏</span>
                </Button>
                <Button className={[styles.btn, styles.share].join(' ')} onClick={() => { handleShareSongClick(songInfo) }}>
                  <span>分享</span>
                </Button>
              </div>

              <div className={[styles.lyricInfo, 'f-brk'].join(' ')}>
                <div className={[styles.lyricContent, controlLyric.isExpand ? styles.expand : ''].join(' ')} >
                  {renderLyric(lyric ?? [])}
                </div>

                <div className={styles.toggleExpand} onClick={toggleLyric}>
                  <span>{controlLyric.label}</span>
                  <i>{controlLyric.iconCls === 'up' ? <UpOutlined /> : <DownOutlined />}</i>
                </div>
              </div>

            </div >
          </div >
        </div >
      </div >
    </div >
  )
}