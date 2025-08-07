import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/supabase/client";
import { Textarea } from "./ui/textarea";
import { Loader2, AlertTriangle, Info, Upload, X, Building } from "lucide-react";

interface SignupPageProps {
  setCurrentPage: (page: string) => void;
}

export function SignupPage({ setCurrentPage }: SignupPageProps) {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    phone: "",
    schoolName: "",
    schoolDescription: ""
  });
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorType("");
    setSuccess("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setErrorType("VALIDATION_ERROR");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setErrorType("VALIDATION_ERROR");
      return;
    }

    if (!formData.userType) {
      setError("Please select your role");
      setErrorType("VALIDATION_ERROR");
      return;
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      setErrorType("VALIDATION_ERROR");
      return;
    }

    // Additional validation for school administrators
    if (formData.userType === 'school' && !formData.schoolName.trim()) {
      setError("School name is required for school administrators");
      setErrorType("VALIDATION_ERROR");
      return;
    }

    try {
      console.log('Starting signup process with data:', { ...formData, password: '[REDACTED]' });
      
      // Prepare signup data including school info and logo
      const signupData = {
        ...formData,
        ...(schoolLogo && { schoolLogo })
      };
      
      const result = await signUp(signupData);
      
      if (result.error) {
        console.error('Signup failed with error:', result);
        setError(result.message || result.error);
        setErrorType(result.error);
        return;
      }

      console.log('Signup successful:', result);
      setSuccess(result.message || "Account created successfully! You are now logged in.");
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 2000);

    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Show more specific error information
      let errorMessage = error.message || "Failed to create account";
      let errorDetails = "";
      
      if (error.message && error.message.includes('Unable to connect to server')) {
        errorDetails = "The server appears to be unavailable. Please try the Connection Test to diagnose the issue.";
      } else if (error.message && error.message.includes('Failed to fetch')) {
        errorDetails = "Network connection failed. This could be due to server issues or network problems.";
      }
      
      setError(errorMessage);
      setErrorType("NETWORK_ERROR");
      
      // Show additional details if available
      if (errorDetails) {
        setTimeout(() => {
          setError(errorMessage + " " + errorDetails);
        }, 1000);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error && errorType === "VALIDATION_ERROR") {
      setError("");
      setErrorType("");
    }
  };

  const handleExistingAccountLogin = () => {
    // Pre-fill email if available
    if (formData.email) {
      // You could pass email to login page here if needed
    }
    setCurrentPage('login');
  };

  const getErrorIcon = () => {
    switch (errorType) {
      case 'DUPLICATE_EMAIL':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getErrorVariant = () => {
    switch (errorType) {
      case 'DUPLICATE_EMAIL':
        return "default"; // Blue info style
      default:
        return "destructive"; // Red error style
    }
  };

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5242880) {
        setError('Logo size must be less than 5MB');
        setErrorType("VALIDATION_ERROR");
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPEG, PNG, GIF, or WebP image');
        setErrorType("VALIDATION_ERROR");
        return;
      }

      setSchoolLogo(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      
      // Clear any previous errors
      if (errorType === "VALIDATION_ERROR") {
        setError("");
        setErrorType("");
      }
    }
  };

  const removeLogo = () => {
    setSchoolLogo(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Note: Google OAuth would need to be configured in Supabase
      setError("Google signup is not configured yet. Please use email signup.");
      setErrorType("FEATURE_NOT_AVAILABLE");
    } catch (error) {
      setError("Google signup failed");
      setErrorType("OAUTH_ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Join the WondasTeach community
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant={getErrorVariant()} className={
              errorType === 'DUPLICATE_EMAIL' ? "border-blue-200 bg-blue-50" : ""
            }>
              {getErrorIcon()}
              <AlertDescription className={
                errorType === 'DUPLICATE_EMAIL' ? "text-blue-800" : ""
              }>
                {error}
                {errorType === 'DUPLICATE_EMAIL' && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExistingAccountLogin}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Sign in instead
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">I am a...</Label>
              <Select 
                onValueChange={(value) => handleInputChange('userType', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="school">School Administrator</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* School Information Fields - Only show for school administrators */}
            {formData.userType === 'school' && (
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">School Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    placeholder="e.g., Springfield Elementary School"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    required={formData.userType === 'school'}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolDescription">School Description</Label>
                  <Textarea
                    id="schoolDescription"
                    placeholder="Brief description of your school, mission, or what makes it special..."
                    value={formData.schoolDescription}
                    onChange={(e) => handleInputChange('schoolDescription', e.target.value)}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                {/* School Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="schoolLogo">School Logo (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="School logo preview" 
                          className="w-16 h-16 object-cover border-2 border-gray-200 rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={removeLogo}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <Label htmlFor="logoUpload" className="cursor-pointer">
                        <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {schoolLogo ? schoolLogo.name : 'Choose school logo'}
                          </span>
                        </div>
                      </Label>
                      <input
                        id="logoUpload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleLogoSelect}
                        className="hidden"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload JPEG, PNG, GIF, or WebP (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" required disabled={loading} />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Button variant="link" className="text-green-600 p-0 h-auto text-sm" type="button">
                  Terms of Service
                </Button>
                {" "}and{" "}
                <Button variant="link" className="text-green-600 p-0 h-auto text-sm" type="button">
                  Privacy Policy
                </Button>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          <Separator />
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignUp}
              disabled={loading}
              type="button"
            >
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={loading}
              type="button"
            >
              Continue with Microsoft
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button 
              variant="link" 
              onClick={() => setCurrentPage('login')}
              className="text-green-600 p-0 h-auto"
              disabled={loading}
              type="button"
            >
              Sign in
            </Button>
          </p>

          {/* Alpha Testing Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 mb-2">
              <strong>Alpha Testing:</strong> If you get a "user already exists" error, 
              it means you've already created an account. Use the "Sign in instead" button above.
            </p>
            {(errorType === "NETWORK_ERROR" || error.includes("Unable to connect")) && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-700 mb-2">
                  <strong>Server Connection Issue:</strong> The server appears to be unavailable. 
                  You can still test the application using offline mode.
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage('connection-test')}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Run Connection Test
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      api.enableMockMode();
                      setError('');
                      setErrorType('');
                    }}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    Enable Offline Mode
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}