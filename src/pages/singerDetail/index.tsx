import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import { getSimilarSinger, getSingerDetail } from "../../services/singer.service";
import { Singer, SingerDetail, Song } from "../../types/GlobalTypes";
import styles from "./index.module.less"
import { songTimeFormat } from "../../utils/timeFormat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentSong } from "../../redux/playerSlice";
import { getSongList } from "../../services/song.service";
import { insertSong, insertSongs, likeSong } from "../../services/batchAction.service";
import { setShareInfo } from "../../redux/memberSlice";
import { likeSinger, LikeSingerType } from "../../services/member.service";

interface SingerDetailParams {
  id: string
}

const singerTableColumns = [
  {
    key: 'index',
    dataIndex: 'index',
    width: '80px'
  },
  {
    key: 'title',
    title: '标题',
    dataIndex: 'title'
  },
  {
    key: 'time',
    title: '时长',
    dataIndex: 'time',
    width: '120px'
  },
  {
    key: 'album',
    title: '专辑',
    dataIndex: 'album'
  }
]

const noDataTip = {
  emptyText: '暂无音乐！',
}

export function SingerDetailCom() {
  const params = useParams<SingerDetailParams>()
  const history = useHistory()

  const [singer, setSinger] = useState<SingerDetail | null>(null)
  const [similarSinger, setSimilarSinger] = useState<Singer[]>([])
  const [hasLiked, setHasLiked] = useState<boolean>(false)

  const currentSong = useAppSelector(selectCurrentSong)

  const dispatch = useAppDispatch()

  useEffect(() => {
    getSinger()
    getSimiSinger()
  }, [params])

  const getSinger = async () => {
    const singerDetail = await getSingerDetail(params.id)
    console.log('singerdetail', singerDetail)
    setSinger(singerDetail)
  }

  const getSimiSinger = async () => {
    const simiSinger = await getSimilarSinger(params.id)
    console.log('simiSinger', simiSinger)
    setSimilarSinger(simiSinger)
  }

  const handleRouteJump = (id: number) => {
    history.push(`/songInfo/${id}`)
  }

  const addSongToList = async (song: Song, isPlay = false) => {
    if (!currentSong || currentSong.id !== song.id) {
      const list = await getSongList(song)
      if (list.length) {
        insertSong(list[0], isPlay)
      }
    }
  }

  const addSongsToList = async (songs: Song[]) => {
    const list = await getSongList(songs)
    if (list.length) {
      insertSongs(list)
    }
  }

  const handleSimiSingerClickRouteJump = (id: number) => {
    history.push(`/singer/${id}`)
  }

  const handleLikeSongsClick = (songs: Song[] | undefined) => {
    if (songs) {
      const ids = songs.map(item => item.id).join(',')
      handleLikeSongClick(ids)
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

  const handleLikeSingerClick = async (id: string | undefined) => {
    if (id) {
      if (!hasLiked) {
        handleLikeSinger(id, LikeSingerType.sub)
      } else {
        handleLikeSinger(id, LikeSingerType.unsub)
      }
    }
  }

  const handleLikeSinger = async (id: string, t: LikeSingerType) => {
    const res = await likeSinger(id, t)
    if (res.code !== 200) {
      message.error(`${res.message || t === LikeSingerType.sub ? '收藏失败' : '取消收藏失败'}`)
    } else {
      message.success(t === LikeSingerType.sub ? '收藏成功' : '取消收藏成功')
      setHasLiked(!hasLiked)
    }
  }


  const createTableData = () => {
    return singer?.hotSongs.map((item, index) => {
      return {
        key: item.id,
        index: (
          <div className='first-col'>
            <span>{index + 1}</span>
            <i className='ico'></i>
          </div>
        ),
        title: (
          <div className="song-name">
            <a onClick={() => { handleRouteJump(item.id) }}>{item.name}</a>
          </div>
        ),
        time: (
          <div className="time-col">
            <span>{songTimeFormat(item.dt / 1000)}</span>
            <p className="icons">
              <i className="ico add" title="添加" ></i>
              <i className="ico like" title="收藏" onClick={() => { handleLikeSongClick(item.id.toString()) }}></i>
              <i className="ico share" title="分享" onClick={() => { handleShareSongClick(item) }}></i>
            </p>
          </div >
        ),
        album: (
          <div>{item.al.name}</div>
        )
      }
    })
  }

  const renderSimilarSinger = () => {
    return similarSinger.map(item => {
      return (
        <li key={item.id} onClick={() => { handleSimiSingerClickRouteJump(item.id) }}>
          <div className={styles.pic}>
            <img src={item.picUrl} alt={item.name} />
          </div>
          <p className='ellipsis'>{item.name}</p>
        </li>
      )
    })
  }

  return (
    <div className={[styles.singerDetail, 'wrap', 'feature-wrap', 'clearfix'].join(' ')}>
      <div className={styles.dtLeft}>
        <div className={styles.leftWrap}>
          <div className={styles.nArtist}>
            <div className={[styles.names, 'clearfix'].join(' ')}>
              <h2 className="ellipsis">{singer?.artist.name}</h2>
              <h3 className="ellipsis">{singer?.artist.alias.join(';')}</h3>
            </div>
            <div className={styles.coverImg}>
              {/**
               * problem:
               * when we click similar singer,the big picture of the singer will have a delay to display.
               * status:
               * NOT SOLVED
               */}
              <img className="full-height" src={singer?.artist.picUrl} alt={singer?.artist.name} />
            </div>
            <button className={[styles.btn, styles.btnLike, hasLiked ? styles.btnLiked : ''].join(' ')} onClick={() => { handleLikeSingerClick(singer?.artist.id.toString()) }}></button>
          </div>

          <div className={styles.top50}>
            <div className={[styles.btns, 'clearfix'].join(' ')}>
              <Button.Group className={styles.btn}>
                <Button className={styles.play} type="primary" icon={<PlayCircleOutlined />} >
                  播放
                </Button>
                <Button className={styles.add} type="primary"  >+</Button>
              </Button.Group>
              <Button className={[styles.btn, styles.like].join(' ')} onClick={() => { handleLikeSongsClick(singer?.hotSongs) }}>
                <span>收藏</span>{singer?.hotSongs.length}
              </Button>
            </div>
            <Table className="wy-table" columns={singerTableColumns} dataSource={createTableData()} locale={noDataTip} pagination={false} bordered />
          </div>
        </div>
      </div >

      <div className={styles.dtRight}>
        <div className={styles.rightWrap}>
          <h3>相似歌手</h3>
          <ul className="clearfix">
            {renderSimilarSinger()}
          </ul>
        </div>
      </div>
    </div>
  )
} 