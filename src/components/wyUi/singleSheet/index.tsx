import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { playsheet } from "../../../services/sheet.service";
import { SongSheet } from "../../../types/GlobalTypes";
import styles from "./index.module.less";

interface SingleSheetProps {
  sheet: SongSheet;
  onPlay: (id: number) => void;
  className?: string
}

export default function SingleSheet(props: SingleSheetProps) {
  const history = useHistory()

  const playCountFormatter = (value: number): number | string => {
    if (value > 10000) {
      return Math.floor(value / 10000) + "万";
    } else {
      return value;
    }
  };

  const handleRouteJump = (id: number) => {
    history.push(`/sheetInfo/${id}`)
  }

  const playSheet = async (id: number) => {
    props.onPlay(id);
  };

  const coverImg = props.sheet.picUrl || props.sheet.coverImgUrl

  return (
    <div className={[styles.sheetItem, props.className ? props.className : ''].join(' ')} onClick={() => { handleRouteJump(props.sheet.id) }}>
      <a className={styles.cover}>
        <img
          className={styles.img}
          src={coverImg}
          alt={props.sheet.name}
        />
        <div className={styles.bottom}>
          <div className={styles.num}>
            <i className={[styles.icon, styles.erji].join(" ")}></i>
            <span className={styles.playCount}>
              {playCountFormatter(props.sheet.playCount)}
            </span>
          </div>
          <i
            className={[styles.icon, styles.play].join(" ")}
            onClick={() => {
              playSheet(props.sheet.id);
            }}
          ></i>
        </div>
      </a>
      <span className={styles.dec}>{props.sheet.name}</span>
    </div>
  );
}
