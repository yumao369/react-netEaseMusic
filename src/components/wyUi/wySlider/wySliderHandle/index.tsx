import React, { useEffect, useState } from "react";
import { WySliderStyle } from "../wySliderTypes";
import styles from "./index.module.less"

interface WySliderHandleProps {
  wyVertical: boolean;
  wyOffset: number;
}

export default function WySliderHandle(props: WySliderHandleProps) {

  const [style, setStyle] = useState<WySliderStyle>({})

  useEffect(() => {
    styleChange()
  }, [])

  const styleChange = () => {
    const changeProperty = props.wyVertical ? 'bottom' : 'left'
    setStyle({ left: props.wyOffset + '%' })
  }

  return (
    <div className={styles.wySliderHandle} style={style}></div>
  )
}