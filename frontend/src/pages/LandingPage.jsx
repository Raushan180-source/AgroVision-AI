import { Link } from 'react-router-dom'
import { Leaf, Zap, Shield, BarChart3, MessageSquare, Sprout, ArrowRight, CheckCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const features = [
  { icon: Leaf, title: 'Disease Detection', desc: 'CNN-powered leaf disease detection with 95%+ accuracy across 38 disease classes.', color: 'primary' },
  { icon: Zap, title: 'Instant Analysis', desc: 'Get results in seconds. Upload a photo and receive detailed diagnosis immediately.', color: 'earth' },
  { icon: Shield, title: 'Treatment Plans', desc: 'Personalized pesticide, fertilizer, and prevention recommendations.', color: 'sky' },
  { icon: BarChart3, title: 'Smart Dashboard', desc: 'Track crop health trends, history, and analytics in one place.', color: 'primary' },
  { icon: MessageSquare, title: 'AI Chatbot', desc: 'Ask any farming question and get expert AI-powered answers instantly.', color: 'earth' },
  { icon: Sprout, title: 'Crop Advisor', desc: 'Get best crop recommendations based on soil, weather, and season.', color: 'sky' },
]

const stats = [
  { value: '38+', label: 'Disease Classes' },
  { value: '14+', label: 'Crop Types' },
  { value: '95%', label: 'Accuracy' },
  { value: '10K+', label: 'Farmers Helped' },
]

export default function LandingPage() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Agro<span className="text-primary-600">Vision</span>
              <span className="text-xs font-medium text-primary-500 ml-1">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/30 dark:bg-sky-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-4 h-4" /> Powered by AI & Machine Learning
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight animate-slide-up">
            Smart Farming with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-sky-500">
              AgroVision AI
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in">
            Detect crop diseases instantly, get treatment recommendations, analyze soil health, and boost your agricultural productivity with cutting-edge AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
              Start Free Analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3">
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center animate-fade-in">
                <div className="text-3xl font-extrabold text-primary-600">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Everything a Farmer Needs</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From disease detection to crop planning — all powered by AI, designed for farmers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => {
              const colorMap = {
                primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
                earth: 'bg-earth-50 dark:bg-earth-900/20 text-earth-600',
                sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600',
              }
              return (
                <div key={title} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Three simple steps to protect your crops</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', desc: 'Take a photo of your crop leaf and upload it to our platform.' },
              { step: '02', title: 'AI Analysis', desc: 'Our CNN model analyzes the image and detects diseases with high accuracy.' },
              { step: '03', title: 'Get Treatment', desc: 'Receive detailed treatment plans, fertilizer tips, and prevention methods.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Protect Your Crops?</h2>
          <p className="text-primary-100 mb-8">Join thousands of farmers using AI to improve their harvest.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-4 h-4 text-primary-500" />
          <span className="text-white font-semibold">AgroVision AI</span>
        </div>
        <p>© {new Date().getFullYear()} AgroVision AI. Built for farmers, powered by AI.</p>
      </footer>
    </div>
  )
}
