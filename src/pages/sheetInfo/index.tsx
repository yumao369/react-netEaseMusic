import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getSongSheetDetail } from "../../services/sheet.service";
import { SongSheet } from "../../types/GlobalTypes";
import { timeFormat } from "../../utils/timeFormat";
import { PlayCircleOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { Button, Tag } from "antd";

interface SheetInfoParams {
  id: string
}

interface Description {
  short: string,
  long: string
}

type ControlDesc = {
  isExpand: boolean,
  label: '展开' | '收起',
  iconCls: 'up' | 'down'
}

export default function SheetInfo() {
  const initControlDesc: ControlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }

  const params = useParams<SheetInfoParams>()

  const [sheetInfo, setSheetInfo] = useState<SongSheet | null>(null)
  const [description, setDescription] = useState<Description | null>(null)
  const [controlDesc, setControlDesc] = useState<ControlDesc>(initControlDesc)

  useEffect(() => {
    getSongSheetInfo()
  }, [])

  useEffect(() => {
    changeDesc(sheetInfo?.description ?? '')
  }, [sheetInfo])

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

  const renderTags = () => {
    return sheetInfo?.tags.map((item, index) => {
      return <Tag className={styles.tagItem} key={index}>{item}</Tag>
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
                  <Button className={styles.play} type="primary" icon={<PlayCircleOutlined />}>
                    播放
                  </Button>
                  <Button className={styles.add} type="primary">+</Button>
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
                <Button type='text' icon={controlDesc.iconCls === 'up' ? <UpOutlined /> : <DownOutlined />}></Button>
              </div>
            </div >
          </div >
        </div >
      </div >
    </div >
  )
}