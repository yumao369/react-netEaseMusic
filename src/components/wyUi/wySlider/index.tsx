import React, { useEffect, useRef, useState } from "react";
import { fromEvent, merge, observable, Observable, Subscriber, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil, exhaustMap } from 'rxjs/internal/operators';
import styles from "./index.module.less"
import { SliderEventObserverConfig, SliderValue } from "./wySliderTypes";
import WySliderHandle from "./wySliderHandle";
import WySliderTrack from "./wySliderTrack";
import ReactDOM from "react-dom";
import { getElementOffset, sliderEvent } from "./wySliderHelper";
import { getPercent, limitNumberInRange } from "../../../utils/number";
import { inArray } from "../../../utils/array";

interface WysliderProps {
  wyVertical?: boolean;
  wyMin?: number;
  wyMax?: number;
  bufferOffset?: number;
}

export default function WySlider(props: WysliderProps) {

  const { wyVertical = false, wyMin = 0, wyMax = 100, bufferOffset = 0 } = props

  const sliderRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const doc = document

  useEffect(() => {
    console.log('props.buffer', bufferOffset)
    const mouseDown$ = fromEvent(sliderRef.current, 'mousedown')
    const mouseMove$ = fromEvent(doc, 'mousemove');
    const mouseUp$ = fromEvent(doc, 'mouseup');
    const subscription = mouseDown$
      .pipe(
        tap((x: MouseEvent) => console.log(x.type)),
        tap(sliderEvent),
        //tap(event => { setX(event.clientX); setY(event.clientY) }),
        map((event: MouseEvent) => wyVertical ? event.clientY : event.clientX),
        tap(position => setOffset(findClosestValue(position))),
        exhaustMap((start) =>
          mouseMove$.pipe(
            tap((x: MouseEvent) => console.log(x.type)),
            tap(sliderEvent),
            //tap(event => { setX(event.clientX); setY(event.clientY) }),
            map((event: MouseEvent) => wyVertical ? event.clientY : event.clientX),
            tap(position => setOffset(findClosestValue(position))),
            takeUntil(mouseUp$)
          )
        )
      )
      .subscribe();
  }, [])


  const findClosestValue = (position: number) => {
    const sliderLength = getSliderLength();

    const sliderStart = getSliderStartPosition();

    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (100 - 0) + 0;
  }

  const getSliderLength = () => {
    return wyVertical ? sliderRef.current.clientHeight : sliderRef.current.clientWidth
  }

  const getSliderStartPosition = () => {
    const offset = getElementOffset(sliderRef.current);
    return wyVertical ? offset.top : offset.left;
  }

  const getElementOffset = (el: HTMLElement) => {
    if (!el.getClientRects().length) {
      return {
        top: 0,
        left: 0
      }
    }

    const rect = el.getBoundingClientRect();
    const win = el.ownerDocument.defaultView;

    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    }
  }

  const limitNumberInRange = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  }

  const sliderEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }



  return (
    <div className={[styles.wySlider, wyVertical ? styles.wySliderVertical : ''].join(' ')} ref={sliderRef}>
      <WySliderTrack wyLength={bufferOffset} wyVertical={wyVertical} wyBuffer={true} />
      <WySliderTrack wyLength={offset} wyVertical={wyVertical} />
      <WySliderHandle wyOffset={offset} wyVertical={wyVertical} />
    </div>
  )
}