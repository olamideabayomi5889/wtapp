import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, AlertCircle, Database, Globe, Key, Users, FileText } from 'lucide-react'
import { getConnectionStatus, getDemoAccounts } from '../utils/supabase'

export function SupabaseSetup() {
  const [status, setStatus] = useState(getConnectionStatus())
  const [demoAccounts] = useState(getDemoAccounts())
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    setStatus(getConnectionStatus())
  }, [])

  const testConnection = async () => {
    setTestResults({ testing: true })
    
    try {
      // Test basic connection
      const { dbService, authService } = await import('../utils/supabase')
      
      const results = {
        connection: status.isConnected,
        mode: status.mode,
        profiles: false,
        jobs: false,
        auth: false
      }

      // Test database operations
      try {
        await dbService.getTeachers(1)
        results.profiles = true
      } catch (error) {
        console.log('Profile test failed:', error)
      }

      try {
        await dbService.getJobs(1)
        results.jobs = true
      } catch (error) {
        console.log('Jobs test failed:', error)
      }

      // Test auth
      try {
        await authService.getCurrentUser()
        results.auth = true
      } catch (error) {
        console.log('Auth test failed:', error)
      }

      setTestResults(results)
    } catch (error) {
      setTestResults({ error: error.message })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl mb-2">WondasTeach Setup</h1>
        <p className="text-gray-600">Configure your Supabase connection for production deployment</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Mode:</span>
            <Badge variant={status.mode === 'supabase' ? 'default' : 'secondary'}>
              {status.mode === 'supabase' ? 'Production (Supabase)' : 'Development (Mock)'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {status.isConnected ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span>Using Mock Data</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>URL:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {status.url}
            </code>
          </div>

          <Button onClick={testConnection} variant="outline" size="sm">
            Test Connection
          </Button>

          {testResults && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Test Results</h4>
              {testResults.testing ? (
                <p>Testing connection...</p>
              ) : testResults.error ? (
                <p className="text-red-600">Error: {testResults.error}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {testResults.connection ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span>Connection: {testResults.mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testResults.profiles ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span>Profiles API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testResults.jobs ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span>Jobs API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testResults.auth ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span>Authentication</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      {!status.hasRealCredentials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Supabase Setup Guide
            </CardTitle>
            <CardDescription>
              Follow these steps to connect your application to Supabase for production deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">1</div>
                <div>
                  <h4 className="font-medium">Create a Supabase project</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">2</div>
                <div>
                  <h4 className="font-medium">Get your credentials</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to Settings → API and copy your Project URL and anon public key
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">3</div>
                <div>
                  <h4 className="font-medium">Set up the database</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Copy and paste the contents of <code>/supabase/schema.sql</code> into the SQL Editor and run it
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">4</div>
                <div>
                  <h4 className="font-medium">Update your configuration</h4>
                  <p className="text-sm text-gray-600 mt-1 mb-2">
                    Choose one of these options:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h5 className="font-medium text-sm mb-2">Option A: Environment Variables (Recommended)</h5>
                      <p className="text-sm text-gray-600 mb-2">Set these environment variables:</p>
                      <div className="bg-gray-800 text-green-400 p-2 rounded text-sm font-mono">
                        <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h5 className="font-medium text-sm mb-2">Option B: Direct Code Replacement</h5>
                      <p className="text-sm text-gray-600 mb-2">Edit <code>/utils/supabase.ts</code> and replace:</p>
                      <div className="bg-gray-800 text-green-400 p-2 rounded text-sm font-mono">
                        <div>const supabaseUrl = 'YOUR_PROJECT_URL_HERE'</div>
                        <div>const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">5</div>
                <div>
                  <h4 className="font-medium">Restart the application</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Restart your development server to load the new configuration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demo Accounts
          </CardTitle>
          <CardDescription>
            {status.hasRealCredentials 
              ? 'These demo accounts are available for testing (they exist in your Supabase database)'
              : 'Use these accounts to test the application in mock mode (password: any text)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoAccounts.map((account, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={account.userType === 'teacher' ? 'default' : 'secondary'}>
                    {account.userType}
                  </Badge>
                  <span className="font-medium">{account.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Email: <code>{account.email}</code></div>
                  <div>Password: {status.hasRealCredentials ? 'demo123' : 'any text'}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Supabase Website</span>
            </a>
            <a 
              href="https://supabase.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </a>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <Key className="h-4 w-4" />
              <span>Schema: /supabase/schema.sql</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {status.hasRealCredentials && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ✅ Your application is connected to Supabase and ready for production deployment!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}