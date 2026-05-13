import ChatBot from '../components/chat/ChatBot'
import { MessageSquare, Zap, BookOpen, HelpCircle } from 'lucide-react'

const capabilities = [
  { icon: Zap, title: 'Disease Diagnosis', desc: 'Ask about symptoms and get instant disease identification help.' },
  { icon: BookOpen, title: 'Treatment Advice', desc: 'Get pesticide and fertilizer recommendations for any crop.' },
  { icon: HelpCircle, title: 'Farming Tips', desc: 'Learn best practices for irrigation, planting, and harvesting.' },
]

export default function ChatPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-primary-600" /> AI Farmer Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Chat with AgroBot — your intelligent farming companion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-4">What I Can Help With</h3>
            <div className="space-y-4">
              {capabilities.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-0 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">AI-Powered</h3>
            <p className="text-xs text-primary-100">
              AgroBot uses advanced AI to provide accurate, context-aware farming advice in real time.
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3">
          <ChatBot />
        </div>
      </div>
    </div>
  )
}
