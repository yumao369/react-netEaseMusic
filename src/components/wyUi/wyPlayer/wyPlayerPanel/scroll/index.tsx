import React, { Children, forwardRef, ForwardRefRenderFunction, ReactElement, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import BScroll from "@better-scroll/core"
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import styles from "./index.module.less"
import { timer } from "rxjs";
import { Song } from "../../../../../types/GlobalTypes";
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

interface WyScrollProps {
  children: React.ReactNode;
  data: Song[];
  getScrollEndHeight: (y: number) => void
}

export interface WyScrollRef {
  refreshScroll: () => void;
  children: ReactNode
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
    listenScrollEnd()
  }, [bs])

  useEffect(() => {
    refreshScroll()
  }, [props.data])

  useImperativeHandle(ref, () => ({
    refreshScroll: refreshScroll,
    children: props.children
  }))

  const initBS = () => {
    if (wrapRef.current) {
      setBs(new BScroll(wrapRef.current, {
        scrollbar: {
          interactive: true
        },
        mouseWheel: {}
      }))
    }
  }

  const refresh = () => {
    bs?.refresh()
  }

  const refreshScroll = () => {
    timer(50).subscribe(() => {
      refresh()
    })
  }

  const listenScrollEnd = () => {
    bs?.on('scrollEnd', ({ y }: { y: number }) => props.getScrollEndHeight(y))
  }

  const scrollToElement = (el: HTMLElement, time: number, offsetX: number | boolean, offsetY: number | boolean) => {
    bs?.scrollToElement(el, time, offsetX, offsetY)
  }

  return (
    <div className={styles.wrap} ref={wrapRef} >
      {props.children}
    </div>
  )
}

export default forwardRef(WyScroll)

