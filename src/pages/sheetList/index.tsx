import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SingleSheet from "../../components/wyUi/singleSheet";
import { getSheets } from "../../services/sheet.service";
import { SheetList, SheetParams } from "../../types/GlobalTypes";
import { Pagination, Radio } from "antd";
import styles from "./index.module.less"
import { onPlaySheetBatch } from "../../services/batchAction.service";

export default function Sheet() {

  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const cat = queryParams.get('cat') || '全部'
  const initListParams: SheetParams = {
    cat: cat,
    order: 'hot',
    offset: 1,
    limit: 35
  }

  const [listParams, setListParams] = useState<SheetParams>(initListParams)
  const [sheets, setSheets] = useState<SheetList | null>(null)

  useEffect(() => {
    getSheetList()
  }, [listParams])

  const getSheetList = async () => {
    const sheetList = await getSheets(listParams)
    setSheets(sheetList)
  }

  const onPlaySheet = (id: number) => {
    onPlaySheetBatch(id)
  }

  const handleRadioChange = (order: 'hot' | 'new') => {
    console.log('order', order)
    const offset = 1
    setListParams({ ...listParams, order, offset })
  }

  const handlePageChange = (page: number) => {
    const offset = page
    setListParams({ ...listParams, offset })
  }

  const renderSheets = () => {
    return sheets?.playlists.map(item => {
      return (
        <SingleSheet className={styles.sheetItem} sheet={item} onPlay={onPlaySheet} key={item.id} />
      )
    })
  }

  return (
    <div className={[styles.sheet, 'wrap', 'feature-wrap'].join(' ')}>
      <div className={styles.listR} >
        <div className={styles.top}>
          <div className={styles.cat} >
            <span>{listParams.cat}</span>
          </div>
          <Radio.Group buttonStyle="solid" defaultValue={listParams.order} onChange={(e) => handleRadioChange(e.target.value)} >
            <Radio.Button value='hot'>热门</Radio.Button>
            <Radio.Button value='new'>最新</Radio.Button>
          </Radio.Group>
        </div>

        <div className={styles.list}>
          {renderSheets()}
        </div>
        <Pagination className={styles.pagination} total={sheets?.total} pageSize={listParams.limit} current={listParams.offset} onChange={handlePageChange} />
      </div >
    </div >
  )
}