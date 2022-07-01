import React, { useEffect, useRef, useState } from "react";
import { Input, InputRef } from "antd"
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, pluck } from "rxjs/internal/operators";
import { SearchResult } from "../../../types/GlobalTypes";
import Overlay from 'react-overlays/Overlay'
import WySearchPanel from "./wySearchPanel";
import styles from "./index.module.less"
import { isEmptyObject } from "../../../utils/tools";

const { Search } = Input

interface WySearchProps {
  getSearchInput: (input: string) => void
  searchResult: SearchResult
}

export default function WySearch(props: WySearchProps) {
  const searchRef = useRef<InputRef | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    //@ts-ignore
    const input$ = fromEvent(searchRef.current?.input, 'input')
    const subscription = input$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      pluck('target', 'value')
    ).subscribe(
      (value) => {
        props.getSearchInput(value as string)
      }
    )
    return () => {
      subscription.unsubscribe()
    }
  })

  useEffect(() => {
    if (!isEmptyObject(props.searchResult)) {
      setShow(true)
    }
  }, [props.searchResult])

  const handleOnFocus = () => {
    if (!isEmptyObject(props.searchResult)) {
      setShow(true)
    }
  }

  const handleHide = () => {
    setShow(false)
  }

  return (
    <div ref={containerRef} className={styles.searchDiv}>
      <Search ref={searchRef} placeholder="歌单/歌手/歌曲" enterButton onFocus={handleOnFocus} onBlur={handleHide} />
      {/**
       * problem:
       * onHide doesn't work when click places outside the overlay,
       * which means WySearchPanel will not disappear when we click
       * the places outside the overlay
       * status:not solved
       */}
      <Overlay show={show} target={searchRef.current?.input ?? null} placement={'bottom'} container={containerRef.current} onHide={handleHide} rootClose={false} rootCloseEvent='click' >
        {() => <WySearchPanel searchResult={props.searchResult} />}
      </Overlay>
    </div>
  )
}