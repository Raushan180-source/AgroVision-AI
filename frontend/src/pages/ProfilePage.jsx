import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, MapPin, Save, Loader2, Camera, Shield, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmSize: user?.farmSize || '',
    primaryCrop: user?.primaryCrop || '',
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Profile updated successfully!')
    setLoading(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your account and preferences</p>
      </div>

      {/* Avatar Card */}
      <div className="card flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{user?.name || 'Farmer'}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mt-2">
            🌿 Verified Farmer
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-5">Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Farmer' },
                { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'farmer@example.com' },
                { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1 234 567 8900' },
                { key: 'location', label: 'Location / Village', icon: MapPin, type: 'text', placeholder: 'e.g. Punjab, India' },
                { key: 'farmSize', label: 'Farm Size (acres)', icon: User, type: 'number', placeholder: 'e.g. 5' },
                { key: 'primaryCrop', label: 'Primary Crop', icon: User, type: 'text', placeholder: 'e.g. Wheat' },
              ].map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} className="input pl-10" />
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-5">Change Password</h3>
          <form className="space-y-4 max-w-sm" onSubmit={(e) => { e.preventDefault(); toast.success('Password updated!') }}>
            {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input type="password" placeholder="••••••••" className="input" />
              </div>
            ))}
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Shield className="w-4 h-4" /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-5">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { label: 'Disease Alerts', desc: 'Get notified when diseases are detected in your scans' },
              { label: 'Weekly Reports', desc: 'Receive weekly crop health summary reports' },
              { label: 'Weather Alerts', desc: 'Get weather warnings that may affect your crops' },
              { label: 'AI Recommendations', desc: 'Receive personalized farming tips from AgroBot' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
