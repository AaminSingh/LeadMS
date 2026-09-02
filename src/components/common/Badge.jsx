function Badge({ status = '' }) {
  const normalizedStatus = String(status).toLowerCase()

  const statusStyles = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-amber-100 text-amber-800 border-amber-200',
    quoted: 'bg-purple-100 text-purple-800 border-purple-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    won: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    lost: 'bg-red-100 text-red-800 border-red-200',
  }

  const badgeStyle =
    statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider capitalize ${badgeStyle}`}
    >
      {status || 'Unknown'}
    </span>
  )
}

export default Badge
