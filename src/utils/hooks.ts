import { useCallback, useState } from "react"

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState(localStorage.getItem(key))
  const updatedSetValue = useCallback((newValue: string | null) => {
    if (newValue) {
      localStorage.setItem(key, newValue)
    } else {
      localStorage.removeItem(key)
    }
    setValue(newValue);
  },
    [key]
  )
  return { value, updatedSetValue }
}