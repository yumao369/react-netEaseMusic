import React, { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { tap, map, takeUntil, exhaustMap } from "rxjs/internal/operators";
import styles from "./index.module.less";
import WySliderHandle from "./wySliderHandle";
import WySliderTrack from "./wySliderTrack";

interface WysliderProps {
  wyVertical?: boolean;
  wyMin?: number;
  wyMax?: number;
  bufferOffset?: number;
  playOffset?: number;
  drag?: (per: number) => void;
}

export default function WySlider(props: WysliderProps) {
  const {
    wyVertical = false,
    wyMin = 0,
    wyMax = 100,
    bufferOffset = 0,
    playOffset = 0,
  } = props;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const doc = document;

  useEffect(() => {
    setOffset(playOffset);
  }, [playOffset]);

  /**
   * subscribe mousedown and setstate,after that aubscribe mousemove and setstate if mouse moves until mouse up.
   *
   */
  useEffect(() => {
    //@ts-ignore
    const mouseDown$ = fromEvent(sliderRef.current, "mousedown");
    const mouseMove$ = fromEvent(doc, "mousemove");
    const mouseUp$ = fromEvent(doc, "mouseup");
    const subscription = mouseDown$
      .pipe(
        //@ts-ignore
        tap(sliderEvent),
        //tap(event => { setX(event.clientX); setY(event.clientY) }),
        //map((event: MouseEvent) => wyVertical ? event.clientY : event.clientX),
        map((event: MouseEvent) => (wyVertical ? event.pageY : event.pageX)),
        tap((position) => {
          setOffset(findClosestValue(position));
          console.log("offset", offset);
          //@ts-ignore
          props.drag(findClosestValue(position));
        }),
        exhaustMap(() =>
          mouseMove$.pipe(
            //@ts-ignore
            tap(sliderEvent),
            //tap(event => { setX(event.clientX); setY(event.clientY) }),
            //map((event: MouseEvent) => wyVertical ? event.clientY : event.clientX),
            map((event: MouseEvent) =>
              wyVertical ? event.pageY : event.pageX
            ),
            tap((position) => {
              setOffset(findClosestValue(position));
              //@ts-ignore
              props.drag(findClosestValue(position));
            }),
            takeUntil(mouseUp$)
          )
        )
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  });

  const findClosestValue = (position: number) => {
    const sliderLength = getSliderLength();
    const sliderStart = getSliderStartPosition();
    const ratio = limitNumberInRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );
    const ratioTrue = wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (wyMax - wyMin) + wyMin;
  };

  const getSliderLength = () => {
    return wyVertical
      ? //@ts-ignore
        sliderRef.current.clientHeight
      : //@ts-ignore
        sliderRef.current.clientWidth;
  };

  const getSliderStartPosition = () => {
    //@ts-ignore
    const offset = getElementOffset(sliderRef.current);
    return wyVertical ? offset.top : offset.left;
  };

  const getElementOffset = (el: HTMLElement) => {
    if (!el.getClientRects().length) {
      return {
        top: 0,
        left: 0,
      };
    }

    //获得元素相对于视窗的位置
    const rect = el.getBoundingClientRect();
    //pageXOffset 和 pageYOffset 属性返回文档在窗口左上角水平和垂直方向滚动的像素。
    const win = el.ownerDocument.defaultView;
    return {
      //@ts-ignore
      top: rect.top + win.pageYOffset,
      //@ts-ignore
      left: rect.left + win.pageXOffset,
    };
  };

  const limitNumberInRange = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  };

  const sliderEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className={[
        styles.wySlider,
        wyVertical ? styles.wySliderVertical : "",
      ].join(" ")}
      ref={sliderRef}
    >
      <WySliderTrack
        wyLength={bufferOffset}
        wyVertical={wyVertical}
        wyBuffer={true}
      />
      <WySliderTrack wyLength={offset} wyVertical={wyVertical} />
      <WySliderHandle wyOffset={offset} wyVertical={wyVertical} />
    </div>
  );
}
