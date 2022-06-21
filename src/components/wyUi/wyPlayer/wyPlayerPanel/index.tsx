import React, { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { async } from "rxjs/internal/scheduler/async";
import { formatTime } from "../../../../functions/formatTime";
import { setCurrentIndex } from "../../../../redux/playerSlice";
import { getLyric } from "../../../../services/song.service";
import { Singer, Song } from "../../../../types/GlobalTypes";
import { findIndex } from "../../../../utils/array";
import styles from "./index.module.less"
import { BaseLyricLine, WyLyric } from "./lyric";
import WyScroll, { WyScrollRef } from "./scroll";

interface WyPlayerPanelProps {
  playing: boolean;
  songList: Song[];
  currentSong: Song;
  show: boolean;
  onChangeSong: (song: Song) => void
}

export default function WyPlayerPanel(props: WyPlayerPanelProps) {

  const [scrollEndHeight, setScrollEndHeight] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [lyric, setLyric] = useState<WyLyric | null>(null)
  const [currentLyric, setCurrentLyric] = useState<BaseLyricLine[]>([])
  const [currentLineNum, setCurrentLineNum] = useState<number>(0)
  const [startLine, setStartLine] = useState<number>(2)
  const songListRef = useRef<WyScrollRef | null>(null)
  const lyricListRef = useRef<WyScrollRef | null>(null)

  useEffect(() => {
    refreshScroll()
    setTimeout(() => {
      if (props.currentSong) {
        scrollToCurrent();
      }
    }, 80);
  }, [props.show])

  useEffect(() => {
    if (props.show) {
      scrollToCurrent()
    }
  }, [currentIndex])

  useEffect(() => {
    refreshCurrentIndex()
  }, [props.currentSong])

  useEffect(() => {
    console.log('scrollEndHeight', scrollEndHeight)
  }, [scrollEndHeight])

  useEffect(() => {
    if (props.currentSong) {

      updateLyric()
    }
  }, [props.currentSong])

  useEffect(() => {
    setCurrentLyric(lyric?.lines ?? [])
    lyric?.handler.subscribe(({ lineNum }) => {
      //const lyricLength = lyricListRef.current?.children?.length
      //console.log('lyricLength', lyricLength)
      console.log('lineNum:', lineNum)
      setCurrentLineNum(lineNum)
      if (lineNum > startLine) {
        const targetLine = lyricListRef.current?.children?.item(lineNum - startLine) as HTMLElement
        if (targetLine) {
          lyricListRef.current?.scrollToElement(targetLine, 300, false, false)
        } else {
          lyricListRef.current?.scrollTo(0, 0)
        }
      }
    })
    handleLyric(startLine)
    return (() => {
      console.log('wwwwwwwwwwwwwwwwwww')
      lyric?.handler.unsubscribe()
    })
  }, [lyric])

  useEffect(() => {
    console.log('props.playing', props.playing)
    lyric?.togglePlay(props.playing)
  }, [props.playing])

  const refreshScroll = () => {
    if (props.show) {
      //console.log('currentSongOffsetHeight', ((songListRef.current?.children as ReactElement).props.children[props.currentIndex] as HTMLElement).offsetHeight)
      //console.log('currentSongOffsetHeight', (songListRef.current?.children?.item(0)?.children.item(props.currentIndex) as HTMLElement).offsetTop)
      //console.log('currentSongOffsetHeight', (songListRef.current?.children?.item(props.currentIndex) as HTMLElement).offsetTop)
      songListRef.current?.refreshScroll()
      lyricListRef.current?.refreshScroll()
    }
  }

  const getScrollEndHeight = (y: number) => {
    setScrollEndHeight(y)
  }

  const scrollToCurrent = () => {
    const currentLi = songListRef.current?.children?.item(currentIndex) as HTMLElement
    const offsetTop = currentLi.offsetTop
    const offsetHeight = currentLi.offsetHeight
    if (((offsetTop - Math.abs(scrollEndHeight)) > offsetHeight * 5 || (offsetTop < Math.abs(scrollEndHeight)))) {
      songListRef.current?.scrollToElement(currentLi, 300, false, false)
    }
  }

  const refreshCurrentIndex = () => {
    const index = findIndex(props.songList, props.currentSong)
    setCurrentIndex(index)
  }

  const updateLyric = async () => {
    resetLyric()
    const res = await getLyric(props.currentSong.id)
    const lyric = new WyLyric(res)
    setStartLine(res.tlyric ? 1 : 2)
    setLyric(lyric)
    /*console.log('lyric', lyric)
    console.log('xxxxxxx')
    lyric.handler.subscribe(({ lineNum }) => {
      console.log('lineNum', lineNum)
      setCurrentLineNum(lineNum)
    })
    console.log('yyyyyyyy')*/
    //setCurrentLyric(lyric.lines)
  }

  const handleLyric = (startLine: number) => {
    //setCurrentLyric(lyric?.lines ?? [])
    console.log('lyric', lyric)


  }

  const resetLyric = () => {
    lyric?.stop()
    setLyric(null)
    setCurrentLyric([])
    setCurrentLineNum(0)
  }

  const renderSongSinger = (singers: Singer[]) => {
    const singerNum = singers.length
    return singers.map((item, index) => {
      return (
        <div className={styles.singerItem} >
          <a className={[styles.col, styles.ellipsis].join(' ')}>{item.name}</a>
          {index === singerNum - 1 ? (
            <></>
          ) : (
            <span className={styles.separate}>/</span>
          )}
        </div>

      )
    })
  }

  const renderPlayList = () => {
    return props.songList.map((item, index) => {
      return (
        <li
          key={item.id}
          className={currentIndex === index ? styles.current : ''}
          onClick={() => props.onChangeSong(item)}
        >
          <i className={[styles.col, styles.arrow].join(' ')}></i>
          <div className={[styles.col, styles.name, styles.ellipsis].join(' ')}>{item.name}</div>
          <div className={[styles.col, styles.icons].join(' ')}>
            <i className={[styles.ico, styles.like].join(' ')} title="收藏"></i>
            <i className={[styles.ico, styles.share].join(' ')} title="分享"></i>
            <i className={[styles.ico, styles.trush].join(' ')} title="删除"></i>
          </div>
          <div className={[styles.singers, styles.clearfix, styles.ellipsis].join(' ')} key={item.id}>
            <div className={styles.anima}>
              {renderSongSinger(item.ar)}
            </div>
          </div>
          <div className={[styles.col, styles.duration].join(' ')}>{formatTime(item.dt / 1000)}</div>
          <div className={[styles.col, styles.link].join(' ')}></div>
        </li>
      )
    })
  }

  const renderLyric = () => {
    return currentLyric.map((item, index) => {
      return (
        <li className={currentLineNum === index ? styles.currentLyric : ''}>
          {item.txt}<br />{item.txtCn}
        </li>
      )
    })
  }

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
        <div className={styles.imgPack}>
          <img src="//music.163.com/api/img/blur/109951163826278397" className={styles.imgbg} />
        </div>
        <div className={styles.msk}></div>
        <div className={styles.listWrap}>
          <WyScroll data={props.songList} ref={songListRef} getScrollEndHeight={getScrollEndHeight}>
            <ul>
              {renderPlayList()}
            </ul >
          </WyScroll>
        </div >
        <div className={styles.listLyric}>
          <WyScroll ref={lyricListRef}>
            <ul>
              {renderLyric()}
            </ul>
          </WyScroll>
        </div>
      </div >
    </div >
  )
}