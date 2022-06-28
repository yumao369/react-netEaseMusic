import React, { useEffect } from "react";
import { PlayCircleOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { useParams } from "react-router-dom";
import { Button } from "antd";

interface SongInfoParams {
  id: string
}

export function SongInfo() {
  const params = useParams<SongInfoParams>()

  return (
    <div className={[styles.songInfo, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.gWrap6}>
        <div className={[styles.mInfo, 'clearfix'].join(' ')}>
          <div className={styles.cover}>
            <div className={styles.mask}></div>
          </div>
          <div className={styles.cnt}>
            <div className={styles.cntc}>
              <div className={[styles.hd, 'clearfix'].join(' ')}>
                <i className={styles.fPr}></i>
                <div className={styles.tit}>
                  <h2 className={[styles.fFf2, styles.fBrk].join(' ')}>{ }</h2>
                </div>
              </div>

              <div className={[styles.user, 'f-cb'].join(' ')}>
                <div className={[styles.singers, 'clearfix'].join(' ')}>
                  <span>歌手：</span>
                  <ul className="clearfix">

                  </ul>
                </div>

                <div className={styles.al}>
                  <span>所属专辑：</span>
                  <span className={styles.alName}>{ }</span>
                </div>
              </div>

              <div className={styles.btns}>
                <Button.Group className={styles.btn}>
                  <Button className={styles.play} type="primary" icon={<PlayCircleOutlined />} >
                    播放
                  </Button>
                  <Button className={styles.add} type="primary" >+</Button>
                </Button.Group>
                <Button className={[styles.btn, styles.like].join(' ')}>
                  <span>收藏</span>
                </Button>
                <Button className={[styles.btn, styles.share].join(' ')}>
                  <span>分享</span>
                </Button>
              </div>






            </div >
          </div >
        </div >
      </div >
    </div >
  )
}