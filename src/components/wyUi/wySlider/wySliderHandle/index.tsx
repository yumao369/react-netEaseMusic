import React, { useEffect, useState } from "react";
import { WySliderStyle } from "../wySliderTypes";
import styles from "./index.module.less"

interface WySliderHandleProps {
  wyVertical: boolean;
  wyOffset: number;
}

export default function WySliderHandle(props: WySliderHandleProps) {

  return (

    <>
      {
        props.wyVertical ? (
          <div className={styles.wySliderHandleVertical} style={{ bottom: `${props.wyOffset}%` }}></div>
        ) : (
          <div className={styles.wySliderHandle} style={{ left: `${props.wyOffset}%` }}></div>
        )
      }
    </>
  )
}