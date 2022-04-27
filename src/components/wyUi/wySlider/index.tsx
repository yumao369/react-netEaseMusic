import React, { useEffect, useRef } from "react";
import { fromEvent, merge, observable, Observable, Subscriber, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
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


  const sliderRef = useRef<HTMLDivElement>(null)
  let refAfterMount: HTMLDivElement
  let dragStart$: Observable<number>;
  let dragMove$: Observable<number>;
  let dragEnd$: Observable<Event>;
  let dragStart_: Subscription | null;
  let dragMove_: Subscription | null;
  let dragEnd_: Subscription | null;
  let isDragging = false;

  useEffect(() => {
    getSliderRef()
  })

  const getSliderRef = () => {
    if (sliderRef.current !== null) {
      refAfterMount = sliderRef.current
    }
  }

  const createDraggingObservables = () => {

    const orientField = props.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: Event) => e instanceof MouseEvent,
      pluckKey: [orientField],
      startPlucked$: new Observable(),
      moveResolved$: new Observable(),
      end$: new Observable()
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: Event) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField],
      startPlucked$: new Observable(),
      moveResolved$: new Observable(),
      end$: new Observable()
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source
      source.startPlucked$ = fromEvent(refAfterMount, start).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: unknown) => findClosestValue(position as number))
      )

      source.end$ = fromEvent(refAfterMount, end)
      source.moveResolved$ = fromEvent(refAfterMount, move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: unknown) => findClosestValue(position as number)),
        takeUntil(source.end$)
      )
    })
    dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$)
    dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$)
    dragEnd$ = merge(mouse.end$, touch.end$)
  }

  const subscribeDrag = (events: string[] = ['start', 'move', 'end']) => {
    if (inArray(events, 'start') && dragStart$ && !dragStart_) {
      dragStart_ = dragStart$.subscribe()
    }
  }

  const toggleDragMoving = (movable: boolean) => {

  }

  const findClosestValue = (position: number): number => {
    // 获取滑块总长
    const sliderLength = getSliderLength();

    // 滑块(左, 上)端点位置
    const sliderStart = getSliderStartPosition();

    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = props.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (props.wyMax - props.wyMin) + props.wyMin;
  }


  const getSliderLength = (): number => {
    return props.wyVertical ? refAfterMount.clientHeight : refAfterMount.clientWidth;
  }

  const getSliderStartPosition = (): number => {
    const offset = getElementOffset(refAfterMount);
    return props.wyVertical ? offset.top : offset.left;
  }





  return (
    <div className={styles.wySlider} ref={sliderRef}>
      <WySliderTrack wyLength={1} wyVertical={false} />
      <WySliderHandle wyOffset={1} wyVertical={false} />
    </div>
  )
}