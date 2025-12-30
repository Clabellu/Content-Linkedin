import { useState, useEffect } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState('checking...')

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status || 'ok'))
      .catch(() => setApiStatus('error'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              LinkedIn Content Automation
            </h1>
            <p className="text-xl text-gray-600">
              Automated content curation for Marketing & AI
            </p>
          </div>

          {/* Status Card */}
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Frontend Status:</span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600 font-semibold">Running</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">API Status:</span>
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    apiStatus === 'ok' ? 'bg-green-500' :
                    apiStatus === 'error' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></span>
                  <span className={`font-semibold ${
                    apiStatus === 'ok' ? 'text-green-600' :
                    apiStatus === 'error' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {apiStatus === 'ok' ? 'Connected' :
                     apiStatus === 'error' ? 'Disconnected' :
                     'Checking...'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Step 1: Setup Complete ✅</p>
            <p className="mt-2">Ready for development</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
