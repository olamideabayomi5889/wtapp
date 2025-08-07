import { useState } from 'react'
import { getConnectionStatus } from '../utils/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, AlertCircle, Info, ExternalLink, Copy, FileText } from 'lucide-react'

export function SupabaseConnectionStatus() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const status = getConnectionStatus()

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const configExample = `// In /utils/supabase.ts, replace these lines:
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'

// With your actual Supabase credentials:
const supabaseUrl = 'https://abcdefgh12345678.supabase.co'  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'`

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Database Connection</CardTitle>
              <Badge variant={status.isConnected ? 'default' : 'secondary'}>
                {status.mode}
              </Badge>
            </div>
            {status.isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <CardDescription>
            {status.isConnected 
              ? 'Connected to Supabase with full database functionality'
              : 'Running in offline mode with mock data - all features work locally'
            }
          </CardDescription>
        </CardHeader>
        
        {!status.isConnected && (
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                WondasTeach is fully functional in offline mode! You can create accounts, 
                post jobs, and submit applications. Data persists during your session.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowInstructions(!showInstructions)}
              >
                <FileText className="h-4 w-4 mr-1" />
                {showInstructions ? 'Hide' : 'Show'} Setup Guide
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://supabase.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Get Supabase Free
              </Button>
            </div>

            {showInstructions && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <h4 className="font-medium mb-2">🚀 5-Minute Supabase Setup</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://supabase.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Create a free Supabase account
                      </a>
                    </li>
                    <li>Create a new project (takes 2-3 minutes)</li>
                    <li>Go to <strong>Settings → API</strong> to get your credentials</li>
                    <li>Update the configuration in <code>/utils/supabase.ts</code></li>
                    <li>Run the database schema from <code>/supabase/schema.sql</code></li>
                    <li>Refresh this page to connect!</li>
                  </ol>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Configuration Example</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(configExample, 'config')}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copied === 'config' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{configExample}
                  </pre>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Good news:</strong> All WondasTeach features work perfectly right now in offline mode. 
                    Connecting Supabase adds persistence across sessions and enables advanced features like 
                    real-time updates.
                  </AlertDescription>
                </Alert>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    📖 Detailed setup instructions available in <code>/supabase/config-template.md</code>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        )}

        {status.isConnected && (
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  ✅ Connected to: {status.url.replace('https://', '').split('.')[0]}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All features active with real-time data persistence
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}