import { encode, decode } from 'js-base64'
import { AnyJson } from '../types/GlobalTypes'

export const encodeBase64 = (source: AnyJson): AnyJson => {
  const result: { [key: string]: string } = {}
  for (const attr in source) {
    if (source.hasOwnProperty(attr)) {
      result[encode(attr)] = encode(source[attr])
    }
  }
  return result
}

export const decodeBase64 = (source: AnyJson): AnyJson => {
  const result: { [key: string]: string } = {}
  for (const attr in source) {
    if (source.hasOwnProperty(attr)) {
      result[decode(attr)] = decode(source[attr])
    }
  }
  return result
}
