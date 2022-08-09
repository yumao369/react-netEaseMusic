/*import { useEffect, useRef, useState } from "react"
import { fromEvent, Observable, PartialObserver, Subject } from "rxjs"
import { takeUntil } from "rxjs/internal/operators"
import { Key } from 'ts-keycode-enum'
import { isEmptyObject } from "../../../../../utils/tools"
import styles from "./index.module.less"

const codeLen = 4
const inputArr = Array(codeLen).fill('')

export default function WyCode() {

  const codeWrapRef = useRef<HTMLDivElement | null>(null)

  const [result, setResult] = useState<string[]>([])
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0)
  const [inputsEl, setInputsEl] = useState<HTMLInputElement[]>([])
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    const codeWrapRefChildren = codeWrapRef.current?.children
    const inputsEl = inputArr.map((item, index) => {
      return codeWrapRefChildren?.item(index)?.children.item(0) as HTMLInputElement
    })
    setInputsEl(inputsEl)
  }, [])*/

/**
 * 问题：
 * 以下的代码是借鉴了angular中的处理逻辑，目前没有报错，不过不知道是不是react中正规的写法
 * status:
 * NOT SOLVED
 */

/*const destory$ = new Subject()

useEffect(() => {
  if (inputsEl.length) {
    inputsEl[0].focus()
    for (let a = 0; a < inputsEl.length; a++) {
      const item = inputsEl[a];
      fromEvent(item, 'keyup').pipe(takeUntil(destory$)).subscribe((e: Event) => listenKeyUp(e as KeyboardEvent));
      fromEvent(item, 'click').pipe(takeUntil(destory$)).subscribe(() => setCurrentFocusIndex(a));
    }

    return () => {
      console.log('xxxxxxx')
      destory$.next()
      destory$.complete()
    }
  }
}, [inputsEl])

useEffect(() => {
  if (inputsEl.length) {
    inputsEl[currentFocusIndex].focus()
  }
}, [currentFocusIndex])

const listenKeyUp = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  //判断是否为退格键
  const isBackSpace = event.keyCode === Key.Backspace
  if (/\D/.test(value)) {

  } else if (value) {

  }
}

const renderInput = () => {
  return inputArr.map((item, index) => {
    return (
      <div className={styles.uWord}>
        <input className={styles.item} />
      </div>
    )
  })
}

return (
  <div className={[styles.codeWrap, 'clearfix'].join(' ')} ref={codeWrapRef}>
    {renderInput()}
  </div>
)
}*/

import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react"
import { Key } from 'ts-keycode-enum'
import styles from "./index.module.less"

const codeLen = 4
const inputArr = Array(codeLen).fill('')

export default function WyCode() {
  const codeWrapRef = useRef<HTMLDivElement | null>(null)
  const [result, setResult] = useState<string[]>([])
  const [inputsEl, setInputsEl] = useState<HTMLInputElement[]>([])
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0)

  useEffect(() => {
    getInputsEl()
  }, [])

  useEffect(() => {
    inputFocus()
  }, [currentFocusIndex, inputsEl])

  const getInputsEl = () => {
    const codeWrapRefChildren = codeWrapRef.current?.children
    const inputsEl = inputArr.map((item, index) => {
      return codeWrapRefChildren?.item(index)?.children.item(0) as HTMLInputElement
    })
    setInputsEl(inputsEl)
  }

  const inputFocus = () => {
    if (inputsEl.length) {
      inputsEl[currentFocusIndex].focus()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { maxLength, value } = e.target
    console.log('xxxxxxxxxxx', value, value === '', /\D/.test(value))
    if (/\D/.test(value)) {
      console.log('yyyyyyyyyyyy')
      e.target.value = ''
    } else if (value.length >= maxLength) {
      console.log('xxxxxxxxxxyyyyyyyyy', currentFocusIndex, result)
      result[currentFocusIndex] = value
      console.log(result)
      setResult(result)
      console.log('zzzzzzzzzzzz')
      if (currentFocusIndex + 1 < codeLen) {
        setCurrentFocusIndex(currentFocusIndex + 1)
      }
    } else if (value === '') {
      console.log('mmmmmmmmmmmmmmm')
      result[currentFocusIndex] = value
      setResult(result)
    }
  }

  const handleDelete = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode, currentTarget } = e
    const { value } = currentTarget
    if (keyCode === Key.Backspace && value === '' && currentFocusIndex - 1 >= 0) {
      console.log('yyyyyyyy')
      setCurrentFocusIndex(currentFocusIndex - 1)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const { target } = e
    inputsEl.map((item, index) => {
      if (item === target) {
        setCurrentFocusIndex(index)
      }
    })
  }

  const renderInput = () => {
    return inputArr.map((item, index) => {
      return (
        <div className={styles.uWord}>
          <input
            className={styles.item}
            maxLength={1}
            onChange={(e) => { handleChange(e) }}
            onKeyDown={(e) => { handleDelete(e) }}
            onClick={(e) => { handleClick(e) }}
          />
        </div>
      )
    })
  }

  return (
    <div className={[styles.codeWrap, 'clearfix'].join(' ')} ref={codeWrapRef}>
      {renderInput()}
    </div>
  )
}