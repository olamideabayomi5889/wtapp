import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Server, 
  Wifi,
  Activity,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { api, API_BASE_URL } from "../utils/supabase/client";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

export function ConnectionTest() {
  const [tests, setTests] = useState({
    supabaseClient: { status: 'pending', message: '', details: '' },
    serverHealth: { status: 'pending', message: '', details: '' },
    signupEndpoint: { status: 'pending', message: '', details: '' },
    analytics: { status: 'pending', message: '', details: '' }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);

  const updateTest = (testName: string, status: 'success' | 'error' | 'pending', message: string, details?: string) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message, details: details || '' }
    }));
  };

  const runConnectionTests = async () => {
    setIsRunning(true);
    setAllTestsPassed(false);
    setServerInfo(null);
    
    // Reset all tests
    setTests({
      supabaseClient: { status: 'pending', message: 'Testing...', details: '' },
      serverHealth: { status: 'pending', message: 'Testing...', details: '' },
      signupEndpoint: { status: 'pending', message: 'Testing...', details: '' },
      analytics: { status: 'pending', message: 'Testing...', details: '' }
    });

    try {
      // Test 1: Supabase Client Connection
      try {
        const { data } = await supabase.auth.getSession();
        updateTest('supabaseClient', 'success', `Connected to project: ${projectId}`, 
          `URL: https://${projectId}.supabase.co`);
      } catch (error: any) {
        updateTest('supabaseClient', 'error', `Failed: ${error.message}`, 
          `Check if project ID and anon key are correct`);
      }

      // Test 2: Server Health Check
      try {
        console.log('Testing server health at:', `${API_BASE_URL}/health`);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Health check response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const healthData = await response.json();
        console.log('Health check data:', healthData);
        
        setServerInfo(healthData);
        updateTest('serverHealth', 'success', `Server is running: ${healthData.service}`, 
          `Status: ${healthData.status}, Timestamp: ${healthData.timestamp}`);
        
      } catch (error: any) {
        console.error('Health check error:', error);
        updateTest('serverHealth', 'error', `Server unreachable: ${error.message}`, 
          `URL: ${API_BASE_URL}/health - Check if Edge Function is deployed`);
      }

      // Test 3: Signup Endpoint Test
      try {
        console.log('Testing signup endpoint at:', `${API_BASE_URL}/auth/signup`);
        
        // Test with invalid data to see if endpoint responds
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Empty body should return validation error
        });

        console.log('Signup test response status:', response.status);
        
        const data = await response.json();
        console.log('Signup test data:', data);
        
        if (data.error && data.error.includes('Missing required fields')) {
          updateTest('signupEndpoint', 'success', 'Signup endpoint is responding correctly', 
            'Validation working - returns "Missing required fields" for empty request');
        } else {
          updateTest('signupEndpoint', 'error', 'Signup endpoint unexpected response', 
            `Response: ${JSON.stringify(data)}`);
        }
        
      } catch (error: any) {
        console.error('Signup endpoint error:', error);
        updateTest('signupEndpoint', 'error', `Signup endpoint failed: ${error.message}`, 
          `This is likely the cause of your signup error`);
      }

      // Test 4: Analytics Endpoint
      try {
        const analyticsResponse = await api.getAnalytics();
        if (analyticsResponse.analytics) {
          updateTest('analytics', 'success', `Analytics active - ${analyticsResponse.analytics.totalUsers} users`, 
            `Last updated: ${analyticsResponse.analytics.timestamp}`);
        } else {
          updateTest('analytics', 'error', 'Analytics endpoint not responding', 
            `Response: ${JSON.stringify(analyticsResponse)}`);
        }
      } catch (error: any) {
        updateTest('analytics', 'error', `Analytics failed: ${error.message}`, 
          'Analytics endpoint may not be properly configured');
      }

    } catch (error) {
      console.error('Connection test error:', error);
    } finally {
      setIsRunning(false);
      
      // Check if all tests passed
      setTimeout(() => {
        const currentTests = Object.values(tests);
        const allPassed = currentTests.every(test => test.status === 'success');
        setAllTestsPassed(allPassed);
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✓ Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">⏳ Testing</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const openSupabaseDashboard = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank');
  };

  const openEdgeFunctions = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank');
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runConnectionTests();
  }, []);

  const hasErrors = Object.values(tests).some(test => test.status === 'error');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              WondasTeach Connection Diagnostics
            </span>
            <Button 
              onClick={runConnectionTests}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Rerun Tests
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            🚨 Issues detected! These problems are likely causing your signup error. Check the failing tests below for solutions.
          </AlertDescription>
        </Alert>
      )}

      {allTestsPassed && !hasErrors && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            🎉 All tests passed! Your connection should be working properly.
          </AlertDescription>
        </Alert>
      )}

      {/* Mock Mode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Offline Mode (Mock Server)</span>
            <Badge variant={api.isMockMode() ? "default" : "outline"}>
              {api.isMockMode() ? "Enabled" : "Disabled"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              If the real server is unavailable, you can enable offline mode to continue testing the application. 
              This uses a mock server that stores data in your browser's local storage.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  api.enableMockMode();
                  setTimeout(() => runConnectionTests(), 500);
                }}
                disabled={api.isMockMode()}
              >
                Enable Offline Mode
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  api.disableMockMode();
                  setTimeout(() => runConnectionTests(), 500);
                }}
                disabled={!api.isMockMode()}
              >
                Disable Offline Mode
              </Button>
            </div>

            {api.isMockMode() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  ℹ️ <strong>Offline Mode Active:</strong> All data is stored locally in your browser. 
                  You can create accounts, post jobs, and test all features. Data will persist between sessions.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Client Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                Supabase Client
              </span>
              {getStatusBadge(tests.supabaseClient.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              {getStatusIcon(tests.supabaseClient.status)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  {tests.supabaseClient.message || 'Tests Supabase client connection and authentication setup'}
                </p>
                {tests.supabaseClient.details && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {tests.supabaseClient.details}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Health Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <Server className="w-5 h-5 mr-2" />
                Backend Server
              </span>
              {getStatusBadge(tests.serverHealth.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              {getStatusIcon(tests.serverHealth.status)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  {tests.serverHealth.message || 'Tests if the Hono server is running and responding'}
                </p>
                {tests.serverHealth.details && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {tests.serverHealth.details}
                  </p>
                )}
                {tests.serverHealth.status === 'error' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={openEdgeFunctions}
                    className="mt-2"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Edge Functions
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signup Endpoint Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Signup Endpoint
              </span>
              {getStatusBadge(tests.signupEndpoint.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              {getStatusIcon(tests.signupEndpoint.status)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  {tests.signupEndpoint.message || 'Tests the specific signup endpoint that is failing'}
                </p>
                {tests.signupEndpoint.details && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {tests.signupEndpoint.details}
                  </p>
                )}
                {tests.signupEndpoint.status === 'error' && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-700 font-medium">
                      ⚠️ This is likely causing your signup error!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Analytics API
              </span>
              {getStatusBadge(tests.analytics.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              {getStatusIcon(tests.analytics.status)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  {tests.analytics.message || 'Tests data persistence and analytics endpoints'}
                </p>
                {tests.analytics.details && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {tests.analytics.details}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Info */}
      {serverInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-800">Service:</span>
                  <p className="text-green-700">{serverInfo.service}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Status:</span>
                  <p className="text-green-700">{serverInfo.status}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Last Response:</span>
                  <p className="text-green-700">{new Date(serverInfo.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Connection Details</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openSupabaseDashboard}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase Dashboard
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Project ID:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{projectId}</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Supabase URL:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              https://{projectId}.supabase.co
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">API Endpoint:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Signup URL:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {API_BASE_URL}/auth/signup
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Troubleshooting Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">If Server Health Check Fails:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Check if your Supabase Edge Function is deployed</li>
                <li>• Verify the function name matches: "make-server-de6c720d"</li>
                <li>• Ensure the function is enabled and not paused</li>
                <li>• Check Edge Function logs for errors</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">If Signup Endpoint Fails:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• This is likely the cause of your "Failed to fetch" error</li>
                <li>• Check if the signup route is properly configured</li>
                <li>• Verify CORS settings allow your domain</li>
                <li>• Check for syntax errors in the server code</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">General Network Issues:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Check your internet connection</li>
                <li>• Try disabling browser extensions</li>
                <li>• Check browser console for additional errors</li>
                <li>• Verify no firewall is blocking requests</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}