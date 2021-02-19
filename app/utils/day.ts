import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale(`ja`)

export default class Day {
  now(formatStr?: string): string {
    return dayjs().format(formatStr)
  }

  relativeTime(dateStr: string): string {
    return dayjs(dateStr).fromNow()
  }

  getUnixMS() {
    return dayjs().valueOf()
  }
}
