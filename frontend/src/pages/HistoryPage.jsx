import { useState } from 'react'
import { Clock, Search, Filter, CheckCircle, AlertTriangle, ScanLine, Download } from 'lucide-react'
import { Badge } from '../components/ui'
import { Link } from 'react-router-dom'

const HISTORY = [
  { id: 1, crop: 'Tomato', disease: 'Early Blight', status: 'infected', confidence: 94, date: '2025-01-15', image: null },
  { id: 2, crop: 'Corn', disease: 'Healthy', status: 'healthy', confidence: 98, date: '2025-01-15', image: null },
  { id: 3, crop: 'Wheat', disease: 'Leaf Rust', status: 'infected', confidence: 87, date: '2025-01-14', image: null },
  { id: 4, crop: 'Rice', disease: 'Healthy', status: 'healthy', confidence: 96, date: '2025-01-14', image: null },
  { id: 5, crop: 'Potato', disease: 'Late Blight', status: 'infected', confidence: 91, date: '2025-01-13', image: null },
  { id: 6, crop: 'Apple', disease: 'Apple Scab', status: 'infected', confidence: 89, date: '2025-01-13', image: null },
  { id: 7, crop: 'Grape', disease: 'Healthy', status: 'healthy', confidence: 97, date: '2025-01-12', image: null },
  { id: 8, crop: 'Pepper', disease: 'Bacterial Spot', status: 'infected', confidence: 85, date: '2025-01-12', image: null },
]

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = HISTORY.filter(h => {
    const matchSearch = h.crop.toLowerCase().includes(search.toLowerCase()) || h.disease.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || h.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-primary-600" /> Scan History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">All your previous crop disease scans</p>
        </div>
        <Link to="/detect" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <ScanLine className="w-4 h-4" /> New Scan
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by crop or disease..."
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'healthy', 'infected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{HISTORY.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Scans</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{HISTORY.filter(h => h.status === 'healthy').length}</p>
          <p className="text-xs text-gray-500 mt-1">Healthy</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500">{HISTORY.filter(h => h.status === 'infected').length}</p>
          <p className="text-xs text-gray-500 mt-1">Infected</p>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disease</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No records found</td>
                </tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.status === 'healthy' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {item.status === 'healthy'
                          ? <CheckCircle className="w-4 h-4 text-primary-600" />
                          : <AlertTriangle className="w-4 h-4 text-red-500" />
                        }
                      </div>
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.crop}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.disease}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === 'healthy' ? 'success' : 'danger'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${item.confidence >= 90 ? 'text-primary-600' : 'text-yellow-600'}`}>
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
