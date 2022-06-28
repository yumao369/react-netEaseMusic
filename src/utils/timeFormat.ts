import moment from 'moment'

export const timeFormat = (time: number) => {
  return moment.utc(new Date(time)).format("YYYY-MM-DD hh:mm:ss")
}

//convert seconds to HH:mm:ss
export const songTimeFormat = (time: number) => {
  return moment(new Date()).startOf('day').seconds(time).format('mm:ss');
}