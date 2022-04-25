import React, { useEffect, useRef } from "react";
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs';
import styles from "./index.module.less"
import { SliderEventObserverConfig } from "./wySliderTypes";
import WySliderHandle from "./wySliderHandle";
import WySliderTrack from "./wySliderTrack";
import ReactDOM from "react-dom";
import { getElementOffset, sliderEvent } from "./wySliderHelper";
import { limitNumberInRange } from "../../../utils/number";
import { inArray } from "../../../utils/array";

interface WysliderProps {
  wyVertical: boolean;
  wyMin: number;
  wyMax: number;
}

export default function WySlider(props: WysliderProps = { wyVertical: false, wyMin: 0, wyMax: 100 }) {

  //const sliderDom = document.getElementsByClassName(styles.wySlider)[0]
  const sliderRef = useRef<HTMLDivElement>(null)
  let dragStart$: Observable<number>
  let dragMove$: Observable<number>
  let dragEnd$: Observable<Event>

  //const dragStart_: Subscription | null;
  //const dragMove_: Subscription | null;
  //const dragEnd_: Subscription | null;

  /*useEffect(() => {
    console.log('sliderDom', sliderDom)
    console.log('sliderRef.current', sliderRef.current, 'sliderRef', sliderRef)
  })*/
  const createDraggingObservables = () => {
    const orientField = props.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      sourcefilter: (e: Event) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      sourcefilter: (e: Event) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, sourcefilter, pluckKey } = source;
      if (sliderRef.current !== null) {
        source.startPlucked$ = fromEvent(sliderRef.current, start)
          .pipe(
            filter(sourcefilter),
            tap(sliderEvent),
            pluck(...pluckKey),
            map((position) => findClosestValue(sliderRef.current, position))
          );

        source.end$ = fromEvent(sliderRef.current, end);
        source.moveResolved$ = fromEvent(sliderRef.current, move).pipe(
          filter(sourcefilter),
          tap(sliderEvent),
          pluck(...pluckKey),
          distinctUntilChanged(),
          map((position) => findClosestValue(sliderRef.current, position)),
          takeUntil(source.end$)
        )
      }
    })
    dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$)
    dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    dragEnd$ = merge(mouse.end$, touch.end$);
  }

  const subscribeDrag(events: string[] = ['start', 'move', 'end']){
    if (inArray(events, 'start') && dragStart$ && !dragStart_) {
      dragStart_ = dragStart$.subscribe()
    }
  }

  const findClosestValue = (ref: HTMLDivElement, position: number): number => {
    const sliderLength = getSliderLength(ref);
    const sliderStart = getSliderStartPosition(ref);
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = props.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (props.wyMax - props.wyMin) + props.wyMin
  }

  /*const getSliderLength = (): number | undefined => {
    return props.wyVertical ? sliderRef.current?.clientHeight : sliderRef.current?.clientWidth
  }

  const getSliderStartPosition = (): number | undefined => {
    if (null !== sliderRef.current) {
      const offset = getElementOffset(sliderRef.current);
      return props.wyVertical ? offset.top : offset.left
    }
  }*/

  const getSliderLength = (ref: HTMLDivElement): number => {
    return props.wyVertical ? ref.clientHeight : ref.clientWidth
  }

  const getSliderStartPosition = (ref: HTMLDivElement): number => {
    const offset = getElementOffset(ref);
    return props.wyVertical ? offset.top : offset.left
  }


  return (
    <div className={styles.wySlider} ref={sliderRef}>
      <WySliderTrack wyLength={1} wyVertical={false} />
      <WySliderHandle wyOffset={1} wyVertical={false} />
    </div>
  )
}