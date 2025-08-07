import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { getDemoAccounts, hasRealCredentials } from "../utils/supabase";
import { Eye, EyeOff, LogIn, User, GraduationCap, Building, AlertCircle } from "lucide-react";

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const demoAccounts = getDemoAccounts();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess('Sign in successful! Redirecting to dashboard...');
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleDemoLogin = async (email: string) => {
    setFormData({ email, password: 'demo123' });
    setError('');
    
    try {
      const result = await signIn(email, 'demo123');
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess('Demo login successful! Redirecting to dashboard...');
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 1000);

    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error.message || 'Demo login failed');
    }
  };

  const getDemoIcon = (userType: string) => {
    switch (userType) {
      case 'teacher':
        return <GraduationCap className="w-4 h-4" />;
      case 'school':
        return <Building className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getDemoColor = (userType: string) => {
    switch (userType) {
      case 'teacher':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'school':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600 mb-2">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to your WondasTeach account</p>
          {!hasRealCredentials && (
            <Badge variant="outline" className="mx-auto mt-2 bg-amber-50 text-amber-700 border-amber-200">
              Demo Mode
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {!hasRealCredentials && demoAccounts.length > 0 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or try demo accounts</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  Quick access to explore the platform:
                </p>
                <div className="grid gap-2">
                  {demoAccounts.map((account, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={getDemoColor(account.userType)}
                      onClick={() => handleDemoLogin(account.email)}
                      disabled={loading}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {getDemoIcon(account.userType)}
                          <span className="ml-2 capitalize">{account.userType}</span>
                        </div>
                        <span className="text-xs truncate ml-2">{account.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {hasRealCredentials ? 'Demo accounts for testing' : 'No password required in demo mode'}
                </p>
              </div>
            </>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-green-600 hover:underline font-medium"
              >
                Sign up here
              </button>
            </p>
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-sm text-gray-500 hover:underline"
            >
              Back to home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}