import { useId } from 'react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

function StatSparkline({ data = [], color = '#0891b2', height = 40 }) {
  const reactId = useId()
  const gradientId = `spark-grad-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  // Normalize data array
  const chartData = (data && data.length > 0
    ? data.map((item, idx) => (typeof item === 'number' ? { val: item } : { val: item.val ?? 0 }))
    : [{ val: 0 }, { val: 0 }]
  )

  // If single point, duplicate baseline so AreaChart renders a sleek line
  const safeData = chartData.length === 1 ? [{ val: 0 }, ...chartData] : chartData

  return (
    <div className="w-full h-[40px] overflow-hidden">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={safeData} margin={{ top: 3, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatSparkline
