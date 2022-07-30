import { Divider, Table } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { RecordType } from "../../../../services/member.service";
import { recordVal, Singer, Song } from "../../../../types/GlobalTypes";
import { songTimeFormat } from "../../../../utils/timeFormat";
import styles from "./index.module.less"

interface MyRecordsProps {
  records: recordVal[];
  recordType: RecordType;
  listenSongs: number | undefined;
}

const myRecordsColumns = [
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
    key: 'signer',
    title: '歌手',
    dataIndex: 'signer',
    width: '80px'
  },
  {
    key: 'playtimes',
    title: '播放次数',
    dataIndex: 'playtimes'
  }
]

const noDataTip = {
  emptyText: '暂无音乐！',
}

export default function MyRecords(props: MyRecordsProps) {
  const history = useHistory()

  const handleRouteJump = (id: number) => {
    history.push(`/songInfo/${id}`)
  }

  const handleSingerClickRouteJump = (id: number) => {
    history.push(`/singer/${id}`)
  }

  const renderSinger = (singers: Singer[]) => {
    const length = singers.length
    return singers.map((item, index) => {
      return (
        <div key={index}>
          <a onClick={() => { handleSingerClickRouteJump(item.id) }}>{item.name}</a>
          <em hidden={index === length - 1}>/</em>
        </div>
      )
    })
  }

  const createTableData = () => {
    return props.records.map((item, index) => {
      return {
        key: index,
        index: (
          <div className='first-col'>
            <span>{index + 1}</span>
            <i className='ico'></i>
          </div>
        ),
        title: (
          <div className="song-name">
            <a onClick={() => { handleRouteJump(item.song.id) }}>{item.song.name}</a>
          </div>
        ),
        time: (
          <div className="time-col">
            <span>{songTimeFormat(item.song.dt / 1000)}</span>
            <p className="icons">
              <i className="ico add" title="添加" ></i>
              <i className="ico like" title="收藏"></i>
              <i className="ico share" title="分享"></i>
            </p>
          </div >
        ),
        signer: (
          <div>
            {renderSinger(item.song.ar)}
          </div>
        ),
        playtimes: (
          <div>{item.playCount}</div>
        )
      }
    })
  }
  return (
    <div className="wy-sec">
      <div className={[styles.uTitle, 'wy-sec-wrap', 'clearfix'].join(' ')}>
        <h3 className="wy-sec-tit"><span className="f-ff2">听歌排行</span></h3>
        <span className={[styles.sub, 's-fc3'].join(' ')}>
          累计听歌{ }首
        </span>
        <div className={[styles.more, 'tab-type'].join(' ')}>
          <span className={styles.active}>最近一周</span>
          <Divider type="vertical" />
          <span>所有时间</span>
        </div>
      </div>

      <Table className="wy-table" columns={myRecordsColumns} dataSource={createTableData()} pagination={false} bordered locale={noDataTip} />

    </div >
  )
}