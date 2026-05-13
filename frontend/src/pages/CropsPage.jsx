import { useState } from 'react'
import { Sprout, Loader2, Thermometer, Droplets, CloudRain, Wind, Sun, TrendingUp } from 'lucide-react'
import { Badge } from '../components/ui'
import { cropAPI } from '../api'
import toast from 'react-hot-toast'

const MOCK_RESULT = [
  { crop: 'Wheat', suitability: 95, season: 'Rabi', yield: '3.5-4.5 tons/ha', water: 'Low', profit: 'High', icon: '🌾' },
  { crop: 'Mustard', suitability: 88, season: 'Rabi', yield: '1.5-2.0 tons/ha', water: 'Low', profit: 'Medium', icon: '🌻' },
  { crop: 'Barley', suitability: 82, season: 'Rabi', yield: '2.5-3.5 tons/ha', water: 'Low', profit: 'Medium', icon: '🌿' },
  { crop: 'Chickpea', suitability: 78, season: 'Rabi', yield: '1.0-1.5 tons/ha', water: 'Very Low', profit: 'High', icon: '🫘' },
  { crop: 'Lentil', suitability: 71, season: 'Rabi', yield: '0.8-1.2 tons/ha', water: 'Low', profit: 'Medium', icon: '🌱' },
]

const seasons = ['Kharif (Summer)', 'Rabi (Winter)', 'Zaid (Spring)']
const soilTypes = ['Alluvial', 'Black Cotton', 'Red Laterite', 'Sandy Loam', 'Clay', 'Loamy']

export default function CropsPage() {
  const [form, setForm] = useState({
    temperature: '', humidity: '', rainfall: '', ph: '',
    nitrogen: '', phosphorus: '', potassium: '',
    season: '', soilType: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await cropAPI.suggest(form)
      setResult(res.data)
    } catch {
      setResult(MOCK_RESULT)
      toast.success('Crop recommendations ready! (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const inputFields = [
    { key: 'temperature', label: 'Temperature (°C)', icon: Thermometer, placeholder: 'e.g. 22' },
    { key: 'humidity', label: 'Humidity (%)', icon: Droplets, placeholder: 'e.g. 65' },
    { key: 'rainfall', label: 'Rainfall (mm)', icon: CloudRain, placeholder: 'e.g. 200' },
    { key: 'ph', label: 'Soil pH', icon: Wind, placeholder: 'e.g. 6.5' },
    { key: 'nitrogen', label: 'Nitrogen (N)', icon: Sun, placeholder: 'e.g. 80' },
    { key: 'phosphorus', label: 'Phosphorus (P)', icon: Sun, placeholder: 'e.g. 40' },
    { key: 'potassium', label: 'Potassium (K)', icon: Sun, placeholder: 'e.g. 60' },
  ]

  const profitColor = { High: 'success', Medium: 'info', Low: 'warning' }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sprout className="w-7 h-7 text-primary-600" /> Crop Advisor
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Get AI-powered crop recommendations based on your soil and climate conditions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-5">Enter Field Conditions</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {inputFields.map(({ key, label, placeholder }) => (
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

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Season</label>
              <select required value={form.season} onChange={set('season')} className="input text-sm">
                <option value="">Select season</option>
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Soil Type</label>
              <select required value={form.soilType} onChange={set('soilType')} className="input text-sm">
                <option value="">Select soil type</option>
                {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sprout className="w-4 h-4" /> Get Recommendations</>}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-800 dark:text-white">Top Crop Recommendations</h2>
              </div>
              {result.map((item, i) => (
                <div key={i} className={`card hover:shadow-md transition-all duration-200 ${i === 0 ? 'border-2 border-primary-300 dark:border-primary-700' : ''}`}>
                  {i === 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        ⭐ Best Match
                      </span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.crop}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Season: {item.season}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-primary-600">{item.suitability}%</div>
                      <div className="text-xs text-gray-500">Suitability</div>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${item.suitability}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                      🌾 Yield: {item.yield}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                      💧 Water: {item.water}
                    </span>
                    <Badge variant={profitColor[item.profit] || 'neutral'}>
                      💰 Profit: {item.profit}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <Sprout className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">No Recommendations Yet</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Fill in your field conditions and click "Get Recommendations" to see the best crops for your land.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
