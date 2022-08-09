export const isEmptyObject = (obj: Object): boolean => {
  return JSON.stringify(obj) === '{}'
}
