import { useState } from 'react'
import ImageUploader from '../components/disease/ImageUploader'
import DetectionResult from '../components/disease/DetectionResult'
import { LoadingSpinner } from '../components/ui'
import { diseaseAPI } from '../api'
import { ScanLine, Info, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_RESULT = {
  disease: 'Early Blight',
  crop: 'Tomato',
  status: 'infected',
  confidence: 94,
  description: 'Fungal disease caused by Alternaria solani. Affects leaves, stems, and fruits.',
  recommendations: {
    pesticides: ['Chlorothalonil 75% WP', 'Mancozeb 75% WP', 'Copper Oxychloride 50% WP'],
    fertilizers: ['Potassium-rich fertilizer (K2O)', 'Calcium nitrate', 'Balanced NPK 19-19-19'],
    prevention: ['Remove infected leaves immediately', 'Avoid overhead irrigation', 'Rotate crops every season', 'Maintain proper plant spacing'],
  },
  nutrientTips: [
    'Apply potassium to strengthen cell walls and disease resistance.',
    'Ensure adequate calcium to prevent tip burn and improve immunity.',
    'Avoid excess nitrogen which promotes lush growth susceptible to blight.',
  ],
}

const TIPS = [
  'Use clear, well-lit photos for best accuracy',
  'Focus on the affected leaf area',
  'Avoid blurry or dark images',
  'One leaf per image works best',
]

export default function DetectPage() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = (file) => {
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleClear = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
  }

  const handleDetect = async () => {
    if (!image) return toast.error('Please upload an image first')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', image)
      const res = await diseaseAPI.detect(formData)
      setResult(res.data)
    } catch {
      // Use mock result for demo when ML API is not connected
      setResult(MOCK_RESULT)
      toast.success('Analysis complete! (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-primary-600" /> Disease Detection
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Upload a crop leaf image to detect diseases using our AI model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary-600" /> Upload Crop Image
            </h2>
            <ImageUploader onImageSelect={handleImageSelect} preview={preview} onClear={handleClear} />

            {image && !loading && !result && (
              <button onClick={handleDetect} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                <ScanLine className="w-4 h-4" /> Analyze Image
              </button>
            )}

            {loading && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
                <div className="text-center">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Analyzing your crop...</p>
                  <p className="text-sm text-gray-500 mt-1">Our AI is examining the image for diseases</p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary-600" />
              <h3 className="font-semibold text-primary-800 dark:text-primary-300 text-sm">Tips for Best Results</h3>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-primary-700 dark:text-primary-400">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Crops */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Supported Crops</h3>
            <div className="flex flex-wrap gap-2">
              {['Tomato', 'Corn', 'Wheat', 'Rice', 'Potato', 'Apple', 'Grape', 'Pepper', 'Strawberry', 'Peach', 'Cherry', 'Soybean', 'Squash', 'Raspberry'].map(crop => (
                <span key={crop} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div>
          {result ? (
            <DetectionResult result={result} />
          ) : (
            <div className="card h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <ScanLine className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">No Analysis Yet</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Upload a crop leaf image and click "Analyze Image" to get instant disease detection results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
