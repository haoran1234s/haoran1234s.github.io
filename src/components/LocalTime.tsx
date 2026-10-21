import { useEffect, useMemo, useState } from 'react'

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'shortOffset',
      }),
    [timeZone],
  )

  return <time dateTime={now.toISOString()}>{formatter.format(now)}</time>
}
