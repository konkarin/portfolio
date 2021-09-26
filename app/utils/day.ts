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
    if (date == null) return dayjs(0).format(formatStr)

    return dayjs(date).format(formatStr)
  }

  relativeTime(date: dayjs.ConfigType): string {
    return dayjs(date).fromNow()
  }

  getUnixMS(date?: dayjs.ConfigType) {
    return dayjs(date).valueOf()
  }
}

export default new Day()
