import React from 'react'
import RawCountUp from 'react-countup'

// Handle Vite / React 19 CJS-ESM interop where default export is wrapped in an object
const ResolvedCountUp = (RawCountUp && typeof RawCountUp.default === 'function')
  ? RawCountUp.default
  : (typeof RawCountUp === 'function' ? RawCountUp : null)

export default function CountUp(props) {
  if (ResolvedCountUp) {
    return <ResolvedCountUp {...props} />
  }

  // Graceful fallback if library cannot be resolved
  const val = props.end ?? 0
  const formatted = props.formattingFn
    ? props.formattingFn(val)
    : `${props.prefix || ''}${val}${props.suffix || ''}`

  return <span className={props.className}>{formatted}</span>
}
