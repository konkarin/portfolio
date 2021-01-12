import dayjs from 'dayjs'

/**
 * unix timestampのミリ秒を返す
 */
export const getUnixMS = (): number => dayjs().valueOf()
