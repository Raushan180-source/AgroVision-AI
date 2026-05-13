import { useState } from 'react'
import { FlaskConical, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { ProgressBar, Badge } from '../components/ui'
import { cropAPI } from '../api'
import toast from 'react-hot-toast'

const MOCK_RESULT = {
  nitrogen: { value: 45, status: 'low', recommendation: 'Apply urea or ammonium nitrate at 50 kg/ha' },
  phosphorus: { value: 72, status: 'optimal', recommendation: 'Phosphorus levels are adequate' },
  potassium: { value: 38, status: 'low', recommendation: 'Apply muriate of potash at 40 kg/ha' },
  ph: { value: 6.2, status: 'optimal', recommendation: 'Soil pH is ideal for most crops' },
  organicMatter: { value: 2.1, status: 'low', recommendation: 'Add compost or farmyard manure to improve organic matter' },
  moisture: { value: 65, status: 'optimal', recommendation: 'Moisture levels are good' },
  suitableCrops: ['Wheat', 'Corn', 'Soybean', 'Sunflower', 'Barley'],
  overallHealth: 68,
  summary: 'Your soil has low nitrogen and potassium levels. Phosphorus and pH are optimal. Consider adding organic matter to improve soil structure and fertility.',
}

const statusConfig = {
  low: { color: 'danger', icon: AlertTriangle, label: 'Low', barColor: 'red' },
  optimal: { color: 'success', icon: CheckCircle, label: 'Optimal', barColor: 'primary' },
  high: { color: 'warning', icon: Info, label: 'High', barColor: 'yellow' },
}

export default function SoilPage() {
  const [form, setForm] = useState({ nitrogen: '', phosphorus: '', potassium: '', ph: '', moisture: '', organicMatter: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await cropAPI.getSoilAnalysis(form)
      setResult(res.data)
    } catch {
      setResult(MOCK_RESULT)
      toast.success('Soil analysis complete! (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const nutrients = [
    { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha', min: 0, max: 150, placeholder: 'e.g. 45' },
    { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha', min: 0, max: 150, placeholder: 'e.g. 72' },
    { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha', min: 0, max: 150, placeholder: 'e.g. 38' },
    { key: 'ph', label: 'Soil pH', unit: '', min: 0, max: 14, placeholder: 'e.g. 6.5' },
    { key: 'moisture', label: 'Moisture (%)', unit: '%', min: 0, max: 100, placeholder: 'e.g. 65' },
    { key: 'organicMatter', label: 'Organic Matter (%)', unit: '%', min: 0, max: 10, placeholder: 'e.g. 2.1' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FlaskConical className="w-7 h-7 text-earth-500" /> Soil & Nutrient Analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Enter your soil test values to get detailed nutrient analysis and recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-5">Enter Soil Test Values</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {nutrients.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    className="input text-sm"
                  />
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><FlaskConical className="w-4 h-4" /> Analyze Soil</>}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-5 p-4 bg-earth-50 dark:bg-earth-900/20 rounded-xl border border-earth-100 dark:border-earth-800">
            <p className="text-xs text-earth-700 dark:text-earth-400 font-medium flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5" /> How to get soil test values
            </p>
            <p className="text-xs text-earth-600 dark:text-earth-500">
              Use a soil testing kit from your local agricultural store, or send samples to a certified soil testing laboratory for accurate NPK and pH readings.
            </p>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div className="space-y-4 animate-slide-up">
            {/* Overall Health */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">Overall Soil Health</h3>
                <span className="text-2xl font-bold text-primary-600">{result.overallHealth}%</span>
              </div>
              <ProgressBar value={result.overallHealth} color={result.overallHealth > 70 ? 'primary' : result.overallHealth > 50 ? 'yellow' : 'red'} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{result.summary}</p>
            </div>

            {/* NPK Cards */}
            <div className="grid grid-cols-1 gap-3">
              {['nitrogen', 'phosphorus', 'potassium', 'ph', 'organicMatter', 'moisture'].map((key) => {
                const data = result[key]
                if (!data) return null
                const cfg = statusConfig[data.status] || statusConfig.optimal
                const Icon = cfg.icon
                const labels = { nitrogen: 'Nitrogen (N)', phosphorus: 'Phosphorus (P)', potassium: 'Potassium (K)', ph: 'Soil pH', organicMatter: 'Organic Matter', moisture: 'Moisture' }
                const maxVals = { nitrogen: 150, phosphorus: 150, potassium: 150, ph: 14, organicMatter: 10, moisture: 100 }
                return (
                  <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${data.status === 'optimal' ? 'text-primary-600' : data.status === 'low' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{labels[key]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">{data.value}</span>
                        <Badge variant={cfg.color}>{cfg.label}</Badge>
                      </div>
                    </div>
                    <ProgressBar value={data.value} max={maxVals[key]} color={cfg.barColor} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.recommendation}</p>
                  </div>
                )
              })}
            </div>

            {/* Suitable Crops */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Suitable Crops for Your Soil</h3>
              <div className="flex flex-wrap gap-2">
                {result.suitableCrops?.map(crop => (
                  <span key={crop} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium border border-primary-100 dark:border-primary-800">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-earth-50 dark:bg-earth-900/20 rounded-2xl flex items-center justify-center mb-4 animate-float">
              <FlaskConical className="w-10 h-10 text-earth-400" />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">No Analysis Yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Enter your soil test values and click "Analyze Soil" to get detailed nutrient analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
