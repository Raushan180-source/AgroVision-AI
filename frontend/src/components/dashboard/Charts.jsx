import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const weeklyData = [
  { day: 'Mon', scans: 4, healthy: 3, infected: 1 },
  { day: 'Tue', scans: 7, healthy: 5, infected: 2 },
  { day: 'Wed', scans: 5, healthy: 4, infected: 1 },
  { day: 'Thu', scans: 9, healthy: 6, infected: 3 },
  { day: 'Fri', scans: 6, healthy: 5, infected: 1 },
  { day: 'Sat', scans: 11, healthy: 8, infected: 3 },
  { day: 'Sun', scans: 8, healthy: 7, infected: 1 },
]

const diseaseData = [
  { name: 'Healthy', value: 62, color: '#22c55e' },
  { name: 'Blight', value: 15, color: '#ef4444' },
  { name: 'Rust', value: 10, color: '#f97316' },
  { name: 'Mildew', value: 8, color: '#eab308' },
  { name: 'Other', value: 5, color: '#94a3b8' },
]

export function ActivityChart() {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Weekly Scan Activity</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={weeklyData}>
          <defs>
            <linearGradient id="healthy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="infected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <Area type="monotone" dataKey="healthy" stroke="#22c55e" fill="url(#healthy)" strokeWidth={2} name="Healthy" />
          <Area type="monotone" dataKey="infected" stroke="#ef4444" fill="url(#infected)" strokeWidth={2} name="Infected" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DiseaseDistribution() {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Disease Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={diseaseData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {diseaseData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
