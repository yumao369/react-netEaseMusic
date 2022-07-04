import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { fromEvent } from "rxjs";
import { tap } from "rxjs/internal/operators";
import { SearchResult } from "../../../../types/GlobalTypes";
import styles from "./index.module.less"

interface WySearchPanelProps {
  searchResult: SearchResult;
  onClickHide: () => void
}

export default function WySearchPanel(props: WySearchPanelProps) {

  const history = useHistory()
  const doc = document

  const toInfo = (e: React.MouseEvent, path: [string, number]) => {
    e.stopPropagation()
    if (path[1]) {
      history.push(`${path[0]}/${path[1]}`)
    }
    props.onClickHide()
  }

  useEffect(() => {
    const docClick$ = fromEvent(doc, 'click')
    const subscriptiondoc = docClick$.subscribe(() => { props.onClickHide() })
    return () => {
      subscriptiondoc.unsubscribe()
    }
  })

  const renderSongs = () => {
    return props.searchResult.songs?.map(item => {
      return <li className='ellipsis' key={item.id} onClick={(e) => { toInfo(e, ['/songInfo', item.id]) }} dangerouslySetInnerHTML={{ __html: item.name }}></li>
    })
  }

  const renderSingers = () => {
    return props.searchResult.artists?.map(item => {
      return <li className='ellipsis' key={item.id} onClick={(e) => { toInfo(e, ['/singer', item.id]) }} dangerouslySetInnerHTML={{ __html: item.name }}></li>
    })
  }

  const renderSheets = () => {
    return props.searchResult.playlists?.map(item => {
      return <li className='ellipsis' key={item.id} onClick={(e) => { toInfo(e, ['/sheetInfo', item.id]) }} dangerouslySetInnerHTML={{ __html: item.name }}></li>
    })
  }

  return (
    <div className={styles.searchPanel} >
      <div className={styles.listWrap}>

        <div className={[styles.listItem, 'clearfix'].join(' ')} hidden={!props.searchResult.songs}>
          <div className={styles.hd}>
            <i className={[styles.ico, styles.icoSong].join(' ')}></i>
            <span>单曲</span>
          </div>
          <ul>
            {renderSongs()}
          </ul>
        </div>


        <div className={[styles.listItem, 'clearfix'].join(' ')} hidden={!props.searchResult.artists}>
          <div className={styles.hd}>
            <i className={[styles.ico, styles.icoSinger].join(' ')}></i>
            <span>歌手</span>
          </div>
          <ul>
            {renderSingers()}
          </ul >
        </div >


        <div className={[styles.listItem, 'clearfix'].join(' ')}  >
          <div className={styles.hd}>
            <i className={[styles.ico, styles.icoSheet].join(' ')}></i>
            <span>歌单</span>
          </div>
          <ul>
            {renderSheets()}
          </ul >
        </div >
      </div >
    </div >
  )
}