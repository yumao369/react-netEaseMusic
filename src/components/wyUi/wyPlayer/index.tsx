import React, { useEffect, useRef, useState } from "react";
import { formatTime } from "../../../functions/formatTime";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectCurrentIndex,
  selectCurrentSong,
  selectPlayList,
  selectSongList,
  setCurrentIndex,
} from "../../../redux/playerSlice";
import WySlider from "../wySlider";
import styles from "./index.module.less";

export default function WyPlayer() {
  const initPicUrl =
    "//s4.music.126.net/style/web2/img/default/default_album.jpg";
  const initDuration = "0:00";
  const bufferOffset = 70;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(initDuration);
  const [playOffset, setPlayOffset] = useState(0);
  const [songReady, setSongReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const dispatch = useAppDispatch();

  const playList = useAppSelector(selectPlayList);
  const songList = useAppSelector(selectSongList);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const currentSong = useAppSelector(selectCurrentSong);

  const picUrl = currentSong ? currentSong.al.picUrl : initPicUrl;
  const duration = currentSong
    ? formatTime(currentSong.dt / 1000)
    : initDuration;

  useEffect(() => {
    setPauseAndPlay();
  }, [playing]);

  const onCanplay = () => {
    setSongReady(true);
    audioRef.current?.play();
    setPlaying(true);
  };

  const onTimeupdate = (e: Event) => {
    if (e.target) {
      const currentTime = (e.target as HTMLAudioElement).currentTime;
      setCurrentTime(formatTime(currentTime));
      setPlayOffset((currentTime / (currentSong?.dt / 1000)) * 100);
    }
  };

  const onPercentChagne = (per: number) => {
    //@ts-ignore
    audioRef.current.currentTime = (currentSong?.dt / 1000) * (per / 100);
  };

  const onToggle = () => {
    if (!currentSong) {
      if (playList.length) {
        updateIndex(0);
      }
    } else {
      if (songReady) {
        setPlaying(!playing);
      }
    }
  };

  const setPauseAndPlay = () => {
    if (playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const onPrev = (index: number) => {
    if (!songReady) return;
    if (playList.length === 1) {
      loop();
    } else {
      const newIndex = index <= 0 ? playList.length - 1 : index;
      updateIndex(newIndex);
    }
  };

  const onNext = (index: number) => {
    if (!songReady) return;
    if (playList.length === 1) {
      loop();
    } else {
      const newIndex = index >= playList.length ? 0 : index;
      updateIndex(newIndex);
    }
  };

  const updateIndex = (index: number) => {
    dispatch(setCurrentIndex({ currentIndex: index }));
    setSongReady(false);
  };

  const loop = () => {
    //@ts-ignore
    audioRef.current.currentTime = 0;
    audioRef.current?.play();
  };

  const renderAuthor = () => {
    const length = currentSong?.ar.length;
    return currentSong?.ar.map((item, index) => {
      return (
        <li className={styles.singer} key={item.id}>
          <a>{item.name}</a>
          <span className={length - 1 === index ? styles.hide : ""}>/</span>
        </li>
      );
    });
  };

  return (
    <div className={styles.musicPlayer}>
      <div className={styles.lock}>
        <div className={styles.left}>
          <i className={styles.leftP}></i>
        </div>
      </div>
      <div className={styles.hand}></div>
      <div className={styles.container}>
        <div className={[styles.wrap, "wrap"].join(" ")}>
          <div className={styles.btns}>
            <i
              className={[styles.prev, styles.btnsCommon].join(" ")}
              onClick={() => {
                onPrev(currentIndex - 1);
              }}
            ></i>
            <i
              className={[
                styles.toggle,
                styles.btnsCommon,
                playing ? styles.playing : "",
              ].join(" ")}
              onClick={onToggle}
            ></i>
            <i
              className={[styles.next, styles.btnsCommon].join(" ")}
              onClick={() => {
                onNext(currentIndex + 1);
              }}
            ></i>
          </div>
          <div className={styles.head}>
            <img className={styles.img} src={picUrl} alt="" />
            <i className={styles.mask}></i>
          </div>
          <div className={styles.play}>
            <div className={[styles.words, styles.clearfix].join(" ")}>
              <p className={styles.ellipsis}>{currentSong?.name}</p>
              <ul className={styles.clearfix}>{renderAuthor()}</ul>
            </div>
            <div className={styles.bar}>
              <div className={styles.sliderWrap}>
                <WySlider
                  bufferOffset={bufferOffset}
                  playOffset={playOffset}
                  drag={onPercentChagne}
                />
              </div>
              <span className={styles.time}>
                <em>{currentTime}</em> / {duration}
              </span>
            </div>
          </div>

          <div className={styles.oper}>
            <i
              className={[styles.like, styles.operCommon].join(" ")}
              title="收藏"
            ></i>
            <i
              className={[styles.share, styles.operCommon].join(" ")}
              title="分享"
            ></i>
          </div>
          <div className={styles.ctrl}>
            <i
              className={[styles.volume, styles.ctrlCommon].join(" ")}
              title="音量"
            ></i>
            <i
              className={[styles.loop, styles.ctrlCommon].join(" ")}
              title="循环"
            ></i>
            <p className={styles.open}>
              <span className={styles.openSpan}></span>
            </p>

            <div className={styles.controlVol}>
              <WySlider wyVertical={true} />
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
      ></audio>
    </div>
  );
}
