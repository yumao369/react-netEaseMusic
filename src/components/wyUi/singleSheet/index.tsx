import React from "react";
import { SongSheet } from "../../../types/GlobalTypes";
import styles from "./index.module.less";


interface SingleSheetProps {
  sheet: SongSheet;
}

export default function SingleSheet(props: SingleSheetProps) {

  const playCountFormatter = (value: number): number | string => {
    if (value > 10000) {
      return Math.floor(value / 10000) + '万';
    } else {
      return value
    }
  }

  return (
    <div className={styles.sheetItem}>
      <a className={styles.cover}>
        <img className={styles.img} src={props.sheet.picUrl} alt={props.sheet.name} />
        <div className={styles.bottom}>
          <div className={styles.num}>
            <i className={[styles.icon, styles.erji].join(' ')}></i>
            <span className={styles.playCount}>{playCountFormatter(props.sheet.playCount)}</span>
          </div>
          <i className={[styles.icon, styles.play].join(" ")}></i>
        </div>
      </a>
      <span className={styles.dec}>{props.sheet.name}</span>
    </div>
  )
}