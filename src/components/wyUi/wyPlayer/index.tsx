import React, { useEffect, useRef, useState } from "react";
import { fromEvent, Subscription } from "rxjs";
import { formatTime } from "../../../functions/formatTime";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectCurrentIndex, selectCurrentSong, selectPlayList, selectPlayMode, selectSongList, setCurrentIndex, setPlayList, setPlayMode } from "../../../redux/playerSlice";
import { PlayMode, Song } from "../../../types/GlobalTypes";
import { shuffle } from "../../../utils/array";
import WySlider from "../wySlider";
import styles from "./index.module.less"

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  }, {
    type: 'random',
    label: '随机'
  }, {
    type: 'singleLoop',
    label: '单曲循环'
  }
];

const modes: string[] = ['loop', 'random', 'singleLoop']

export default function WyPlayer() {

  const initPicUrl = "//s4.music.126.net/style/web2/img/default/default_album.jpg"
  const initDuration = '0:00'
  const bufferOffset = 70
  const doc = document

  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(initDuration)
  const [playOffset, setPlayOffset] = useState(0)
  const [songReady, setSongReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [modeCount, setModeCount] = useState<0 | 1 | 2>(0)
  const [showVolPanel, setShowVolPanel] = useState(false)
  const [selfClick, setSelfClick] = useState(false)

  const dispatch = useAppDispatch()

  const playList = useAppSelector(selectPlayList)
  const songList = useAppSelector(selectSongList)
  const currentIndex = useAppSelector(selectCurrentIndex)
  const mode = useAppSelector(selectPlayMode)
  const currentSong = useAppSelector(selectCurrentSong)

  const picUrl = currentSong ? currentSong.al.picUrl : initPicUrl
  const duration = currentSong ? formatTime(currentSong.dt / 1000) : initDuration


  useEffect(() => {
    setPauseAndPlay()
  }, [playing])

  useEffect(() => {
    if (selfClick) {
      const docClick$ = fromEvent(doc, 'click')
      const subscription = docClick$.subscribe(handleDocClick)
      return () => {
        subscription.unsubscribe()
      }
    }
  })

  useEffect(() => {
    handleModeChange()
  }, [mode])

  const handleDocClick = () => {
    setShowVolPanel(false)
  }

  const onCanplay = () => {
    setSongReady(true)
    audioRef.current?.play()
    setPlaying(true)
  }

  const onTimeupdate = (e: Event) => {
    if (e.target) {
      const currentTime = (e.target as HTMLAudioElement).currentTime
      setCurrentTime(formatTime(currentTime))
      setPlayOffset(currentTime / (currentSong?.dt / 1000) * 100)
    }
  }

  const changeMode = () => {
    const modeCount = modes.indexOf(mode.type) + 1
    dispatch(setPlayMode({ playMode: modeTypes[modeCount % 3] }))
  }

  const handleModeChange = () => {
    if (songList) {
      let list = songList.slice()
      if (mode.type === 'random') {
        list = shuffle(songList)
        updateCurrentIndex(list, currentSong)
        dispatch(setPlayList({ playList: list }))
      }
    }
  }

  const updateCurrentIndex = (list: Song[], song: Song) => {
    const newIndex = list.findIndex(item => item.id === song.id)
    dispatch(setCurrentIndex({ currentIndex: newIndex }))
  }

  const onPercentChagne = (per: number) => {
    if (currentSong) {
      //@ts-ignore
      audioRef.current.currentTime = (currentSong?.dt / 1000) * (per / 100)
    }
  }

  const toggleVolPanel = () => {
    togglePanel()
  }

  const togglePanel = () => {
    setShowVolPanel(!showVolPanel)
  }

  const selfClickChange = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelfClick(true)
  }

  const onVolumeChange = (vol: number) => {
    //@ts-ignore
    audioRef.current.volume = vol / 100
  }

  const onToggle = () => {
    if (!currentSong) {
      if (playList.length) {
        updateIndex(0)
      }
    } else {
      if (songReady) {
        setPlaying(!playing)
      }
    }
  }

  const setPauseAndPlay = () => {
    if (playing) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }

  const onPrev = (index: number) => {
    if (!songReady) return
    if (playList.length === 1) {
      loop()
    } else {
      const newIndex = index <= 0 ? playList.length - 1 : index
      updateIndex(newIndex)
    }
  }

  const onNext = (index: number) => {
    if (!songReady) return
    if (playList.length === 1) {
      loop()
    } else {
      const newIndex = index >= playList.length ? 0 : index
      updateIndex(newIndex)
    }
  }

  const onEnded = () => {
    setPlaying(false)
    if (mode.type === 'singleLoop') {
      loop();
    } else {
      onNext(currentIndex + 1);
    }
  }

  const updateIndex = (index: number) => {
    dispatch(setCurrentIndex({ currentIndex: index }))
    setSongReady(false)
  }

  const loop = () => {
    //@ts-ignore
    audioRef.current.currentTime = 0
    audioRef.current?.play()
  }

  const renderAuthor = () => {
    const length = currentSong?.ar.length
    return currentSong?.ar.map((item, index) => {
      return <li className={styles.singer} key={item.id}>
        <a>{item.name}</a>
        <span className={length - 1 === index ? styles.hide : ''}>/</span>
      </li>
    })
  }

  return (
    <div
      className={styles.musicPlayer}
      //@ts-ignore
      onClick={selfClickChange}>
      <div className={styles.lock}>
        <div className={styles.left}><i className={styles.leftP}></i></div>
      </div>
      <div className={styles.hand}></div>
      <div className={styles.container}>
        <div className={[styles.wrap, 'wrap'].join(" ")}>
          <div className={styles.btns}>
            <i className={[styles.prev, styles.btnsCommon].join(' ')} onClick={() => { onPrev(currentIndex - 1) }}></i>
            <i className={[styles.toggle, styles.btnsCommon, playing ? styles.playing : ''].join(' ')} onClick={onToggle}></i>
            <i className={[styles.next, styles.btnsCommon].join(' ')} onClick={() => { onNext(currentIndex + 1) }}></i>
          </div>
          <div className={styles.head}>
            <img className={styles.img} src={picUrl} alt="" />
            <i className={styles.mask}></i>
          </div>
          <div className={styles.play}>
            <div className={[styles.words, styles.clearfix].join(" ")} >
              <p className={styles.ellipsis}>{currentSong?.name}</p>
              <ul className={styles.clearfix}>
                {renderAuthor()}
              </ul>
            </div>
            <div className={styles.bar}>
              <div className={styles.sliderWrap}>
                <WySlider bufferOffset={bufferOffset} playOffset={playOffset} drag={onPercentChagne} />
              </div>
              <span className={styles.time}>
                <em>{currentTime}</em> / {duration}
              </span>
            </div>
          </div>

          <div className={styles.oper}>
            <i className={[styles.like, styles.operCommon].join(' ')} title="收藏"></i>
            <i className={[styles.share, styles.operCommon].join(' ')} title="分享"></i>
          </div>
          <div className={styles.ctrl}>
            <i className={[styles.volume, styles.ctrlCommon].join(' ')} title="音量" onClick={toggleVolPanel}></i>
            <i className={[styles[mode.type], styles.ctrlCommon].join(' ')} title={mode.label} onClick={changeMode}></i>
            <p className={styles.open}>
              <span className={styles.openSpan}></span>
            </p>

            <div className={[styles.controlVol, showVolPanel ? '' : styles.hide].join(' ')}>
              <WySlider wyVertical={true} drag={onVolumeChange} />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong?.url}
        onCanPlay={onCanplay}
        //@ts-ignore
        onTimeUpdate={onTimeupdate}
        onEnded={onEnded}></audio>
    </div>
  )
}