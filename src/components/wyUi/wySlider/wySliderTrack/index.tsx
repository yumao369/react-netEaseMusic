import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import { WySliderStyle } from "../wySliderTypes";

interface WySliderTrackProps {
  wyVertical: boolean;
  wyLength: number;
  wyBuffer?: boolean;
}

export default function WySliderTrack(props: WySliderTrackProps) {

  const { wyLength } = props

  useEffect(() => {
    console.log('wylength', wyLength)
  })

  return (
    <>
      {
        props.wyVertical ? (
          <div className={[styles.wySliderTrackVertical, props.wyBuffer ? styles.buffer : ''].join(' ')} style={{ height: `${wyLength}%` }}></div>
        ) : (
          <div className={[styles.wySliderTrack, props.wyBuffer ? styles.buffer : ''].join(' ')} style={{ width: `${wyLength}%` }}></div>
        )
      }
    </>
  )
}