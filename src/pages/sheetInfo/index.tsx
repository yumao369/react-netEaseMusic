import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getSongSheetDetail } from "../../services/sheet.service";
import { Control, Singer, Song, SongSheet } from "../../types/GlobalTypes";
import { songTimeFormat, timeFormat } from "../../utils/timeFormat";
import { PlayCircleOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { Button, Table, Tag } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentSong } from "../../redux/playerSlice";
import { findIndex } from "../../utils/array";
import { getSongList } from "../../services/song.service";
import { insertSong, insertSongs, onPlaySheetBatch } from "../../services/batchAction.service";

interface SheetInfoParams {
  id: string
}

interface Description {
  short: string,
  long: string
}

const listTableColumns = [
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
    key: 'singer',
    title: '歌手',
    dataIndex: 'singer',
    width: '80px'
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

export default function SheetInfo() {
  const initControlDesc: Control = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }

  const params = useParams<SheetInfoParams>()

  const [sheetInfo, setSheetInfo] = useState<SongSheet | null>(null)
  const [description, setDescription] = useState<Description | null>(null)
  const [controlDesc, setControlDesc] = useState<Control>(initControlDesc)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const currentSong = useAppSelector(selectCurrentSong)
  const history = useHistory()

  useEffect(() => {
    getSongSheetInfo()
  }, [params])

  useEffect(() => {
    changeDesc(sheetInfo?.description ?? '')
    listenCurrent()
  }, [sheetInfo])

  useEffect(() => {
    console.log(currentSong)
    listenCurrent()
  }, [currentSong])

  const listenCurrent = () => {
    if (currentSong) {
      const index = findIndex(sheetInfo?.tracks ?? [], currentSong)
      console.log('index', index)
      setCurrentIndex(index)
    }
  }

  const getSongSheetInfo = async () => {
    const sheetInfo = await getSongSheetDetail(Number(params.id))
    setSheetInfo(sheetInfo)
  }

  const changeDesc = (desc: string) => {
    if (desc.length < 99) {
      const newDesc = {
        short: `<b>介绍：</b>${desc}`,
        long: ''
      }
      setDescription(newDesc)
    } else {
      const newDesc = {
        short: `<b>介绍：</b>${desc.slice(0, 99)}...`,
        long: `<b>介绍：</b>${desc}`
      }
      setDescription(newDesc)
    }
  }

  const toggleDesc = () => {
    const isExpand = !controlDesc.isExpand
    const label = isExpand ? '收起' : '展开'
    const iconCls = isExpand ? 'up' : 'down'
    setControlDesc({ isExpand, label, iconCls })
  }

  const createMarkup = (richText: string) => {
    const newText = richText.replaceAll('\n', '<br/>')
    return { __html: newText };
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

  const addSongsToList = async (songs: Song[]) => {
    const list = await getSongList(songs)
    if (list.length) {
      insertSongs(list)
    }
  }

  const handleRouteJump = (id: number) => {
    history.push(`/songInfo/${id}`)
  }

  const renderTags = () => {
    return sheetInfo?.tags.map((item, index) => {
      return <Tag className={styles.tagItem} key={index}>{item}</Tag>
    })
  }

  const renderTableSingers = (ar: Singer[]) => {
    const length = ar.length
    return ar.map((item, index) => {
      return (
        <div key={index}>
          <a>{item.name}</a>
          <em hidden={index === length - 1}>/</em>
        </div>
      )
    })
  }

  const createTableData = () => {
    return sheetInfo?.tracks.map((item, index) => {
      return {
        key: item.id,
        index: (
          <div className='first-col'>
            <span>{index + 1}</span>
            <i className={['ico', currentIndex === index ? 'current' : ''].join(' ')} onClick={() => { addSongToList(item, true) }}></i>
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
              <i className="ico add" title="添加" onClick={() => { addSongToList(item) }}></i>
              <i className="ico like" title="收藏"></i>
              <i className="ico share" title="分享"></i>
            </p>
          </div >
        ),
        singer: (
          <div>
            {renderTableSingers(item.ar)}
          </div>
        ),
        album: (
          <div>{item.al.name}</div>
        )
      }
    })
  }

  return (
    <div className={[styles.sheetInfo, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.gWrap6}>
        <div className={[styles.mInfo, 'clearfix'].join(' ')}>
          <div className={styles.cover}>
            <img src={sheetInfo?.coverImgUrl} alt={sheetInfo?.name} />
            <div className={styles.mask}></div>
          </div>
          <div className={styles.cnt}>
            <div className={styles.cntc}>
              <div className={[styles.hd, 'clearfix'].join(' ')}>
                <i className={styles.fPr}></i>
                <div className={styles.tit}>
                  <h2 className={[styles.fFf2, styles.fBrk].join(' ')}>{sheetInfo?.name}</h2>
                </div>
              </div>
              <div className={[styles.user, styles.fCb].join(" ")}>
                <a className={styles.face} hidden={!sheetInfo?.creator} href={`//music.163.com/artist?id=${sheetInfo?.userId}`}>
                  <img src={sheetInfo?.creator.avatarUrl} alt={sheetInfo?.creator.nickname} />
                </a>
                <span className={styles.name}>
                  <a href={`//music.163.com/artist?id=${sheetInfo?.userId}`} className={styles.sFc7}>{sheetInfo?.creator.nickname}</a>
                </span>
                <span className={[styles.time, styles.sFc4].join(' ')}>{timeFormat(sheetInfo?.createTime ?? 0)} 创建</span>
              </div>

              <div className={styles.btns}>
                <Button.Group className={styles.btn}>
                  <Button className={styles.play} type="primary" icon={<PlayCircleOutlined />} onClick={() => { onPlaySheetBatch(sheetInfo?.id ?? 0) }}>
                    播放
                  </Button>
                  <Button className={styles.add} type="primary" onClick={() => { addSongsToList(sheetInfo?.tracks ?? []) }}>+</Button>
                </Button.Group>
                <Button className={[styles.btn, styles.like].join(' ')}>
                  <span>收藏</span>({sheetInfo?.subscribedCount})
                </Button>
                <Button className={[styles.btn, styles.share].join(' ')}>
                  <span>分享</span>({sheetInfo?.shareCount})
                </Button>
              </div>

              <div className={[styles.tags, 'clearfix'].join(' ')}>
                <span>标签</span>
                <div className={styles.tagWrap}>
                  {renderTags()}
                </div>
              </div>
              <div className={[styles.intr, styles.fBrk].join(' ')} hidden={controlDesc.isExpand}>
                <p dangerouslySetInnerHTML={createMarkup(description?.short ?? '')}></p>
              </div>
              <div className={[styles.intr, styles.fBrk].join(' ')} hidden={!controlDesc.isExpand}>
                <p dangerouslySetInnerHTML={createMarkup(description?.long ?? '')}></p>
              </div>
              <div className={styles.expand} onClick={toggleDesc} >
                <span>{controlDesc.label}</span>
                <i>{controlDesc.iconCls === 'up' ? <UpOutlined /> : <DownOutlined />}</i>
              </div>
            </div >
          </div >
        </div >


        <div className='wy-sec'>
          <div className={[styles.uTitle, 'wy-sec-wrap', 'clearfix'].join(' ')}>
            <h3 className='wy-sec-tit'>
              <span className={styles.fFf2}>歌曲列表</span>
            </h3>
            <span className={[styles.sub, styles.sFc3].join(' ')}>
              {sheetInfo?.tracks.length} 首歌
            </span>
            <div className={[styles.more, styles.sFc3].join(' ')}>
              播放：
              <strong className={styles.sFc6}>{sheetInfo?.playCount}</strong>
              次
            </div>
          </div>
          <Table className='wy-table' locale={noDataTip} pagination={false} bordered columns={listTableColumns} dataSource={createTableData()} />
        </div>
      </div >
    </div >
  )
}