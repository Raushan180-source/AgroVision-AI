import { CheckCircle, AlertTriangle, Info, Pill, Droplets, ShieldCheck } from 'lucide-react'
import { Badge, ProgressBar } from '../ui'

export default function DetectionResult({ result }) {
  const isHealthy = result.status === 'healthy'

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Status Banner */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 ${
        isHealthy
          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        {isHealthy
          ? <CheckCircle className="w-10 h-10 text-primary-600 flex-shrink-0" />
          : <AlertTriangle className="w-10 h-10 text-red-500 flex-shrink-0" />
        }
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{result.disease}</h3>
            <Badge variant={isHealthy ? 'success' : 'danger'}>
              {isHealthy ? 'Healthy' : 'Infected'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.crop} • {result.description}</p>
        </div>
      </div>

      {/* Confidence */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence Score</span>
          <span className="text-lg font-bold text-primary-600">{result.confidence}%</span>
        </div>
        <ProgressBar value={result.confidence} color={result.confidence > 80 ? 'primary' : 'yellow'} />
        <p className="text-xs text-gray-500 mt-2">
          {result.confidence > 85 ? 'High confidence detection' : result.confidence > 65 ? 'Moderate confidence — consider re-uploading a clearer image' : 'Low confidence — please upload a clearer image'}
        </p>
      </div>

      {/* Recommendations */}
      {!isHealthy && result.recommendations && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RecommendCard icon={Pill} title="Pesticides" items={result.recommendations.pesticides} color="red" />
          <RecommendCard icon={Droplets} title="Fertilizers" items={result.recommendations.fertilizers} color="sky" />
          <RecommendCard icon={ShieldCheck} title="Prevention" items={result.recommendations.prevention} color="primary" />
        </div>
      )}

      {/* Nutrient Tips */}
      {result.nutrientTips && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-sky-500" />
            <h4 className="font-semibold">Nutrient Improvement Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.nutrientTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function RecommendCard({ icon: Icon, title, items, color }) {
  const colors = {
    red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    sky: 'text-sky-500 bg-sky-50 dark:bg-sky-900/20',
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  }
  return (
    <div className="card">
      <div className={`inline-flex p-2 rounded-lg ${colors[color]} mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <ul className="space-y-1">
        {items?.map((item, i) => (
          <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
            <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
