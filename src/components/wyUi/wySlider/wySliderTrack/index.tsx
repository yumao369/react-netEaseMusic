import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import { WySliderStyle } from "../wySliderTypes";

interface WySliderHandleProps {
  wyVertical: boolean;
  wyLength: number;
}

export default function WySliderTrack(props: WySliderHandleProps) {

  const [style, setStyle] = useState<WySliderStyle>({})

  useEffect(() => {
    styleChange()
  }, [])

  const styleChange = () => {
    if (props.wyVertical) {
      setStyle({
        height: props.wyLength + '%'
      })
    } else {
      setStyle({
        width: props.wyLength + '%'
      })
    }
  }
  return (
    <div className={styles.wySliderTrack} style={style}></div>
  )
}