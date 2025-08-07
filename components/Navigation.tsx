import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, Wifi, WifiOff } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isServerOnline?: boolean;
}

export function Navigation({ currentPage, setCurrentPage, isServerOnline = true }: NavigationProps) {
  const { user, profile, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentPage('landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setCurrentPage('landing')}
        >
          <div className="w-8 h-8 bg-green-500 rounded-lg mr-3"></div>
          <span className="text-xl text-green-600">WondasTeach</span>
          <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
            Alpha
          </Badge>
          {!isServerOnline && (
            <Badge className="ml-2 text-xs bg-orange-100 text-orange-800 border-orange-200">
              <WifiOff className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user && profile ? (
            // Authenticated user navigation
            <>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md ${
                  currentPage === 'dashboard' ? 'bg-gray-100' : ''
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('profile-edit')}
                className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm ${
                  currentPage === 'profile-edit' ? 'bg-gray-100' : ''
                }`}
              >
                Edit Profile
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                  <span className="text-green-700 text-sm font-medium">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium text-sm">
                    {profile.first_name} {profile.last_name}
                  </span>
                  <span className="text-gray-500 text-xs capitalize">
                    {profile.user_type === 'teacher' ? 'Teacher' : 
                     profile.user_type === 'school' ? 'School Admin' : 
                     profile.user_type}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            // Non-authenticated user navigation
            <>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage('login')}
                className="text-green-600 border-green-600 hover:bg-green-50"
                disabled={loading}
              >
                Login
              </Button>
              <Button 
                onClick={() => setCurrentPage('signup')}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}