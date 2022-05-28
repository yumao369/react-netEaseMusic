import React from "react";
import { Song } from "../../../../types/GlobalTypes";
import styles from "./index.module.less"

interface WyPlayerPanelProps {
  songList: Song[];
  currentSong: Song;
  currentIndex: number;
  show: boolean;
}

export default function WyPlayerPanel(props: WyPlayerPanelProps) {
  return (
    <div className={[styles.playPanel, props.show ? styles.show : ""].join(' ')}>
      <div className={styles.hd}>
        <div className={styles.hdc}>
          <h4>播放列表(<span>{props.songList.length}</span>)</h4>
          <div className={styles.addAll}>
            <i className={styles.icon} title="收藏全部"></i>收藏全部
          </div>
          <span className={styles.line}></span>
          <div className={styles.clearAll}>
            <i className={[styles.icon, styles.trush].join(' ')} title="清除"></i>清除
          </div>
          <p className={styles.playingName}>{props.currentSong?.name}</p>
          <i className={[styles.icon, styles.close].join(' ')} ></i>
        </div>
      </div >

      <div className={styles.bd}>
        <img src="//music.163.com/api/img/blur/109951163826278397" className={styles.imgbg} />
        <div className={styles.addAll}></div>
        <div className={styles.listWrap}>
          <ul>
            <li >
              <i className={[styles.col, styles.arrow].join(' ')}></i>
              <div className={[styles.col, styles.name, styles.ellipsis].join(' ')}>{ }</div>
              <div className={[styles.col, styles.icons].join(' ')}>
                <i className={[styles.ico, styles.like].join(' ')} title="收藏"></i>
                <i className={[styles.ico, styles.share].join(' ')} title="分享"></i>
                <i className={[styles.ico, styles.trush].join(' ')} title="删除"></i>
              </div>
              <div className={[styles.singers, styles.clearfix, styles.ellipsis].join(' ')}>
                <div className={styles.singerItem} >
                  <a className={[styles.col, styles.ellipsis].join(' ')}>{ }</a>
                  <span >/</span>
                </div>
              </div>
              <div className={[styles.col, styles.duration].join(' ')}>{ }</div>
              <div className={[styles.col, styles.link].join(' ')}></div>
            </li>
          </ul >
        </div >

        <ul>
          歌词
        </ul>
      </div >
    </div >
  )
}