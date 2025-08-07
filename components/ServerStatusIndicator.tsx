import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { api } from "../utils/supabase/client";
import { 
  Info, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Server
} from "lucide-react";

interface ServerStatusIndicatorProps {
  onStatusChange?: (isOnline: boolean) => void;
}

export function ServerStatusIndicator({ onStatusChange }: ServerStatusIndicatorProps) {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline' | 'mock'>('checking');
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkServerStatus = async (showRetrying = false) => {
    if (showRetrying) {
      setIsRetrying(true);
    } else {
      setServerStatus('checking');
    }

    try {
      const result = await api.healthCheck();
      
      if (result._isMock || result.mode === 'mock') {
        setServerStatus('mock');
        onStatusChange?.(false);
      } else {
        setServerStatus('online');
        onStatusChange?.(true);
        // Clear any server unavailable flags
        sessionStorage.removeItem('server-unavailable');
        sessionStorage.removeItem('mock-mode-activated');
        sessionStorage.removeItem('mock-mode-reason-logged');
        localStorage.removeItem('mock-mode-logged');
        
        // Log successful reconnection
        if (sessionStorage.getItem('was-offline')) {
          console.log('✅ Successfully reconnected to server');
          sessionStorage.removeItem('was-offline');
        }
      }
    } catch (error) {
      // Don't log expected network errors as failures
      const isNetworkError = !navigator.onLine || 
                             (error as Error).message?.includes('Failed to fetch');
      
      if (!isNetworkError) {
        console.log('Server check failed:', error);
      }
      
      setServerStatus('offline');
      onStatusChange?.(false);
      sessionStorage.setItem('was-offline', 'true');
    } finally {
      setIsRetrying(false);
      setLastChecked(new Date());
    }
  };

  const handleRetryConnection = () => {
    // Clear offline flags and reset logging
    sessionStorage.removeItem('server-unavailable');
    sessionStorage.removeItem('mock-mode-activated');
    sessionStorage.removeItem('mock-mode-reason-logged');
    localStorage.removeItem('mock-mode-logged');
    
    console.log('🔄 Retrying server connection...');
    checkServerStatus(true);
  };

  const enableMockMode = () => {
    api.enableMockMode();
    setServerStatus('mock');
    onStatusChange?.(false);
  };

  useEffect(() => {
    checkServerStatus();
    
    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🌐 Internet connection restored');
      checkServerStatus();
    };
    
    const handleOffline = () => {
      console.log('📴 Internet connection lost - switching to offline mode');
      setServerStatus('offline');
      onStatusChange?.(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check status periodically when offline
    const interval = setInterval(() => {
      if (serverStatus === 'offline' && navigator.onLine) {
        checkServerStatus();
      }
    }, 30000); // Check every 30 seconds when offline

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [serverStatus]);

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'mock':
        return <Server className="w-4 h-4 text-orange-600" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (serverStatus) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Live Server</Badge>;
      case 'offline':
        return <Badge variant="destructive">Server Offline</Badge>;
      case 'mock':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Offline Mode</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusMessage = () => {
    const isNetworkOffline = !navigator.onLine;
    
    switch (serverStatus) {
      case 'online':
        return 'Connected to live server. All features available with real-time sync.';
      case 'offline':
        return isNetworkOffline 
          ? 'No internet connection. Using offline mode with local data storage.'
          : 'Server temporarily unavailable. Using offline mode with local data storage.';
      case 'mock':
        return 'Running in offline mode. All features work normally with persistent local data.';
      case 'checking':
        return 'Checking server connection...';
      default:
        return 'Server status unknown.';
    }
  };

  if (serverStatus === 'online') {
    return null; // Don't show indicator when everything is working normally
  }

  return (
    <div className="border-b border-orange-200 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Alert className="border-orange-200 bg-transparent">
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge()}
                {lastChecked && (
                  <span className="text-xs text-orange-700">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <AlertDescription className="text-orange-800 text-sm mb-2">
                <strong>{serverStatus === 'mock' ? 'Offline Mode:' : 'Server Offline:'}</strong>{' '}
                {getStatusMessage()}
              </AlertDescription>
              
              <div className="flex flex-wrap gap-2">
                {(serverStatus === 'offline' || serverStatus === 'mock') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetryConnection}
                    disabled={isRetrying}
                    className="text-orange-700 border-orange-300 hover:bg-orange-100"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Retry Connection
                      </>
                    )}
                  </Button>
                )}
                
                {serverStatus === 'offline' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={enableMockMode}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Continue Offline
                  </Button>
                )}

                {serverStatus === 'mock' && (
                  <div className="text-xs text-orange-700 flex items-center gap-1 px-2 py-1 bg-orange-100 rounded">
                    <Info className="w-3 h-3" />
                    All data is saved locally and will sync when server is available
                  </div>
                )}
              </div>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}