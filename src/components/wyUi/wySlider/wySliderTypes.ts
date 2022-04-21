import { Observable } from 'rxjs';

export type WySliderStyle = {
  width?: string;
  height?: string;
  left?: string;
  bottom?: string;
}

export type SliderEventObserverConfig = {
  start: string;
  move: string;
  end: string;
  filter: (e: Event) => boolean;
  pluckKey: string[];
  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;
}

export type SliderValue = number | null;