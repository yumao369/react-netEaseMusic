import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import { WySliderStyle } from "../wySliderTypes";

interface WySliderTrackProps {
  wyVertical: boolean;
  wyLength: number;
  wyBuffer?: boolean;
}

export default function WySliderTrack(props: WySliderTrackProps = { wyVertical: false, wyLength: 0, wyBuffer: false }) {


  return (
    <>
      {
        props.wyVertical ? (
          <div className={[styles.wySliderTrackVertical, props.wyBuffer ? styles.buffer : ''].join(' ')} style={{ width: `${props.wyLength}%` }}></div>
        ) : (
          <div className={styles.wySliderTrack} style={{ width: `${props.wyLength}%` }}></div>
        )
      }
    </>
  )
}