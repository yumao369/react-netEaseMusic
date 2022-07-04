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

  const onClickHide = () => {
    setShow(false)
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div ref={containerRef} className={styles.searchDiv}>
      <Search
        ref={searchRef}
        placeholder="歌单/歌手/歌曲"
        enterButton
        onFocus={handleOnFocus}
        onClick={(e) => { handleOnClick(e) }}
      //onBlur={handleHide} 
      />
      {/**
       * problem:
       * onHide doesn't work when click places outside the overlay,
       * which means WySearchPanel will not disappear when we click
       * the places outside the overlay
       * status:not solved
       * 
       * problem:
       * onBlur will make overlay disappear when Search lose focus.
       * But once the overlay disapper,the component it contains will
       * be destoryed.however in the components it contains, 
       * we need to click on the list item and make a routing jump,
       * which happens at the same time as Search losing focus.So 
       * we will see that after clicking on the list item, 
       * the overlay disappears , but the page does not jump
       * status:not solved
       * thougths about the problem:
       * Can we change the order of event execution? At present,
       * it seems that onblur is monitored first, and then the 
       * component is destroyed immediately, resulting in no click
       * event being monitored. Can we execute the callback of the
       * click event first, and then execute the callback of onblur
       * status:not solved
       * 
       * solution:
       * We can monitor the click event on the document to decide whether 
       * we need to destory WySearchPanel when we click places outside this
       * component.In order to implement this,we need to stop propagation in
       * some places.One is to prevent bubbling when the component itself is 
       * clicked, and the other is to prevent bubbling when clicking the search
       * component.
       */}
      <Overlay show={show} target={searchRef.current?.input ?? null} placement={'bottom'} container={containerRef.current} onHide={handleHide} rootClose={true}  >
        {() => <WySearchPanel searchResult={props.searchResult} onClickHide={onClickHide} />}
      </Overlay>
    </div>
  )
}