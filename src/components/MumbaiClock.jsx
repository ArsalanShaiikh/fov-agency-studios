import { useMumbaiTime } from '../hooks/useMumbaiTime'

export default function MumbaiClock({ className = '' }) {
  const { time, offset, iso } = useMumbaiTime()
  return (
    <p className={`mono-label ${className}`}>
      Mumbai{' '}
      <time dateTime={iso} className="tabular-nums">
        {time}
      </time>{' '}
      IST{offset && <span className="normal-case opacity-80"> · {offset}</span>}
    </p>
  )
}
