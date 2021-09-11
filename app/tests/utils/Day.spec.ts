import Day from '@/utils/day'

const ISO8061Regex = /^\d{4}-\d{2}-\d{2}/
const ISO8061Format = 'YYYY-MM-DD'
const ISO8061Date = '2021-04-25'
const unixMS = 1619320549795

describe('utils/day', () => {
  test('get correct now dateStr', () => {
    expect(ISO8061Regex.test(Day.now(ISO8061Format))).toBe(true)
  })

  test('get correct specified date', () => {
    expect(ISO8061Regex.test(Day.getDate(unixMS, ISO8061Format))).toBe(true)
  })

  test('get error date', () => {
    expect(Day.getDate(null, ISO8061Format)).toBe('1970-01-01')
  })

  test('get correct relative time', () => {
    expect(Day.relativeTime(unixMS)).toContain('前')
  })

  test('get correct unix timestamp', () => {
    const unixtime = Day.getUnixMS(ISO8061Date)

    expect(unixtime).not.toBeNaN()
    expect(typeof unixtime).toBe('number')
  })
})
