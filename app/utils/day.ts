import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale(`ja`)

class Day {
  now(formatStr?: string): string {
    return dayjs().format(formatStr)
  }

  getDate(date: dayjs.ConfigType, formatStr?: string) {
    return dayjs(date).format(formatStr)
  }

  relativeTime(date: string | Date): string {
    return dayjs(date).fromNow()
  }

  getUnixMS(date?: dayjs.ConfigType) {
    return dayjs(date).valueOf()
  }
}

export default new Day()
