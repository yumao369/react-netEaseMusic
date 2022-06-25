import moment from 'moment'

export const timeFormat = (time: number) => {
  return moment.utc(new Date(time)).format("YYYY-MM-DD hh:mm:ss")
}