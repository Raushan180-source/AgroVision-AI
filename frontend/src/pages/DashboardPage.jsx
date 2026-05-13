import { useAuth } from '../context/AuthContext'
import { StatCard } from '../components/ui'
import { ActivityChart, DiseaseDistribution } from '../components/dashboard/Charts'
import {
  Leaf, ScanLine, CheckCircle, AlertTriangle, CloudSun,
  Clock, TrendingUp, Sprout, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const recentScans = [
  { crop: 'Tomato', disease: 'Early Blight', status: 'infected', confidence: 94, time: '2 hours ago' },
  { crop: 'Corn', disease: 'Healthy', status: 'healthy', confidence: 98, time: '5 hours ago' },
  { crop: 'Wheat', disease: 'Leaf Rust', status: 'infected', confidence: 87, time: '1 day ago' },
  { crop: 'Rice', disease: 'Healthy', status: 'healthy', confidence: 96, time: '2 days ago' },
  { crop: 'Potato', disease: 'Late Blight', status: 'infected', confidence: 91, time: '3 days ago' },
]

const quickActions = [
  { label: 'Detect Disease', icon: ScanLine, to: '/detect', color: 'from-primary-500 to-primary-600' },
  { label: 'Soil Analysis', icon: Leaf, to: '/soil', color: 'from-earth-500 to-earth-600' },
  { label: 'Crop Advisor', icon: Sprout, to: '/crops', color: 'from-sky-500 to-sky-600' },
  { label: 'AI Assistant', icon: CloudSun, to: '/chat', color: 'from-purple-500 to-purple-600' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0] || 'Farmer'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Here's your crop health overview for today
          </p>
        </div>
        <Link to="/detect" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <ScanLine className="w-4 h-4" /> New Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Scans" value="50" icon={ScanLine} color="primary" trend={12} />
        <StatCard title="Healthy Crops" value="38" icon={CheckCircle} color="primary" trend={8} />
        <StatCard title="Diseases Found" value="12" icon={AlertTriangle} color="red" trend={-3} />
        <StatCard title="Crops Monitored" value="6" icon={Sprout} color="earth" trend={5} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map(({ label, icon: Icon, to, color }) => (
            <Link
              key={to}
              to={to}
              className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center gap-3 text-center`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <DiseaseDistribution />
      </div>

      {/* Recent Scans */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" /> Recent Scans
          </h3>
          <Link to="/history" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentScans.map((scan, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  scan.status === 'healthy'
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {scan.status === 'healthy'
                    ? <CheckCircle className="w-5 h-5 text-primary-600" />
                    : <AlertTriangle className="w-5 h-5 text-red-500" />
                  }
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{scan.crop}</p>
                  <p className="text-xs text-gray-500">{scan.disease}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{scan.confidence}%</p>
                <p className="text-xs text-gray-400">{scan.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="card bg-gradient-to-br from-sky-500 to-sky-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sky-100 text-sm font-medium">Current Weather</p>
            <p className="text-4xl font-bold mt-1">24°C</p>
            <p className="text-sky-100 text-sm mt-1">Partly Cloudy • Humidity 68%</p>
            <p className="text-sky-200 text-xs mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Good conditions for crop growth
            </p>
          </div>
          <CloudSun className="w-20 h-20 text-white/30" />
        </div>
      </div>
    </div>
  )
}
