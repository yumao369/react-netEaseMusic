import React, { useRef } from "react";
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

  const sliderDom = document.getElementsByClassName(styles.wySlider)[0]
  const dragStart$: Observable<number>
  const dragMove$: Observable<number>
  const dragEnd$: Observable<Event>

  const dragStart_: Subscription | null;
  const dragMove_: Subscription | null;
  const dragEnd_: Subscription | null;

  const createDraggingObservables = () => {
    const orientField = props.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: Event) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: Event) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source;
      source.startPlucked$ = fromEvent(sliderDom, start)
        .pipe(
          filter(filterFunc),
          tap(sliderEvent),
          pluck(...pluckKey),
          map((position: number) => findClosestValue(position))
        );

      source.end$ = fromEvent(sliderDom, end);
      source.moveResolved$ = fromEvent(sliderDom, move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => findClosestValue(position))
        takeUntil(source.end$)
      )

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

  const findClosestValue = (position: number): number => {
    const sliderLength = getSliderLength();
    const sliderStart = getSliderStartPosition();
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = props.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (props.wyMax - props.wyMin) + props.wyMin
  }

  const getSliderLength = (): number => {
    return props.wyVertical ? sliderDom.clientHeight : sliderDom.clientWidth
  }

  const getSliderStartPosition = (): number => {
    const offset = getElementOffset(sliderDom);
    return props.wyVertical ? offset.top : offset.left
  }

  return (
    <div className={styles.wySlider}>
    </div>
  )
}