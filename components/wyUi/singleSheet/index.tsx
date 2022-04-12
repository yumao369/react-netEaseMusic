import React from "react";
import { SongSheet } from "../../../src/types/GlobalTypes";
import styles from "./index.module.less";


interface SingleSheetProps {
  sheet: SongSheet;
}

export default function SingleSheet(props: SingleSheetProps) {
  return (
    <div>
      <a className={styles.cover}>
        <img src={props.sheet.picUrl} alt={props.sheet.name} />
        <div className={styles.bottom}>
          <div className={styles.num}>
            <i className={[styles.icon, styles.erji].join(' ')}></i>
            <span>{props.sheet.playCount}</span>
          </div>
        </div>
      </a>
    </div>
  )
}