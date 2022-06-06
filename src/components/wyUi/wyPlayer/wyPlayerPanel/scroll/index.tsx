import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import BScroll from "@better-scroll/core"
import styles from "./index.module.less"
import { timer } from "rxjs";
import { Song } from "../../../../../types/GlobalTypes";
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";

interface WyScrollProps {
  children: React.ReactNode;
  data: Song[];
}

export interface WyScrollRef {
  refreshScroll: () => void
}

const WyScroll: ForwardRefRenderFunction<WyScrollRef, WyScrollProps> = (props, ref) => {
  const [bs, setBs] = useState<BScrollConstructor | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('wrapraf', wrapRef.current?.offsetHeight)
    initBS()
    return () => {
      bs?.destroy()
    }
  }, [])

  useEffect(() => {
    refreshScroll()
  }, [props.data])

  useImperativeHandle(ref, () => ({
    refreshScroll: refreshScroll
  }))

  const initBS = () => {
    console.log('wrapref.current', wrapRef.current)
    if (wrapRef.current) {
      setBs(new BScroll(wrapRef.current))
    }
  }

  const refresh = () => {
    console.log('refresh', 'bs', bs, bs?.refresh)
    bs?.refresh()
  }

  const refreshScroll = () => {
    timer(50).subscribe(() => {
      refresh()
    })
  }

  return (
    <div className={styles.wrap} ref={wrapRef} >
      {props.children}
    </div>
  )
}

export default forwardRef(WyScroll)

