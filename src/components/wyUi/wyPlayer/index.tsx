import React from "react";
import WySlider from "../wySlider";
import styles from "./index.module.less"

export default function WyPlayer() {
  return (
    <div className={styles.musicPlayer}>
      <div className={styles.lock}>
        <div className={styles.left}><i className={styles.leftP}></i></div>
      </div>
      <div className={styles.hand}></div>
      <div className={styles.container}>
        <div className={[styles.wrap, 'wrap'].join(" ")}>
          <div className={styles.btns}>
            <i className={[styles.prev, styles.btnsCommon].join(' ')}></i>
            <i className={[styles.toggle, styles.btnsCommon].join(' ')}></i>
            <i className={[styles.next, styles.btnsCommon].join(' ')}></i>
          </div>
          <div className={styles.head}>
            <img className={styles.img} src="//s4.music.126.net/style/web2/img/default/default_album.jpg" />
            <i className={styles.mask}></i>
          </div>
          <div className={styles.play}>
            <div className={[styles.words, styles.clearfix, styles.hide].join(" ")} >
              <p className={styles.ellipsis}>歌名</p>
              <ul className={[styles.songs, styles.clearfix].join(" ")}>
                <li className={styles.singer}>
                  <a>歌手1</a>/
                </li>
                <li className={styles.singer}>
                  <a>歌手2</a>
                </li>
              </ul>
            </div>
            <div className={styles.bar}>
              <div className={styles.sliderWrap}>
                <WySlider wyMax={100} wyMin={0} wyVertical={false} />
              </div>
              <span className={styles.time}>
                <em>02:11</em> / 04:35
              </span>
            </div>
          </div>

          <div className={styles.oper}>
            <i className={[styles.like, styles.operCommon].join(' ')} title="收藏"></i>
            <i className={[styles.share, styles.operCommon].join(' ')} title="分享"></i>
          </div>
          <div className={styles.ctrl}>
            <i className={[styles.volume, styles.ctrlCommon].join(' ')} title="音量"></i>
            <i className={[styles.loop, styles.ctrlCommon].join(' ')} title="循环"></i>
            <p className={styles.open}>
              <span className={styles.openSpan}></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}