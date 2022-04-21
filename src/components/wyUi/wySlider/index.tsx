import React, { useRef } from "react";
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs';
import styles from "./index.module.less"
import { SliderEventObserverConfig } from "./wySliderTypes";
import WySliderHandle from "./wySliderHandle";
import WySliderTrack from "./wySliderTrack";
import ReactDOM from "react-dom";
import { sliderEvent } from "./wySliderHelper";

interface WysliderProps {
  wyVertical: boolean;
  wyMin: number;
  wyMax: number;
}

export default function WySlider(props: WysliderProps = { wyVertical: false, wyMin: 0, wyMax: 100 }) {

  const sliderDom = document.getElementsByClassName(styles.wySlider)

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
        )
    })
  }

  return (
    <div className={styles.wySlider}>
    </div>
  )
}