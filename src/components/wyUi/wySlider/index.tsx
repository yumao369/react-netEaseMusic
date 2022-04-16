import React from "react";
import styles from "./index.module.less"

export default function WySlider() {
  return (
    <div className={styles.wySlider}>
      <div className={styles.wySliderTrack}></div>
      <div className={styles.wySliderHandle}></div>
    </div>
  )
}