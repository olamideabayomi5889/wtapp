import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { dbService } from "../utils/supabase";
import { 
  User, 
  Camera, 
  Save, 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  X,
  Building
} from "lucide-react";

interface ProfileEditPageProps {
  setCurrentPage: (page: string) => void;
}

export function ProfileEditPage({ setCurrentPage }: ProfileEditPageProps) {
  const { user, profile, updateProfile: updateAuthProfile, session } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    experience: '',
    education: '',
    skills: '',
    location: '',
    availability: 'available',
    school_name: '',
    school_description: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        experience: profile.experience || '',
        education: profile.education || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || ''),
        location: profile.location || '',
        availability: profile.availability || 'available',
        school_name: profile.school_name || '',
        school_description: profile.user_type === 'school' ? profile.bio || '' : ''
      });
      setProfileImage(profile.profile_image || null);
    } else if (user) {
      // If no profile but user exists, set up basic form with user data
      console.log('🔧 Setting up form for user without profile');
      setFormData({
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || '',
        bio: '',
        experience: '',
        education: '',
        skills: '',
        location: '',
        availability: 'available',
        school_name: '',
        school_description: ''
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5242880) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPEG, PNG, GIF, or WebP image');
        return;
      }

      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setError('');
    }
  };

  const uploadImage = async () => {
    if (!imageFile || !user?.id) {
      return null;
    }

    setImageUploading(true);
    try {
      const imageUrl = await dbService.uploadProfileImage(user.id, imageFile);
      return imageUrl;
    } catch (error: any) {
      console.error('Image upload error:', error);
      setError('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Upload image first if there's a new one
      let imageUrl = profileImage;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Prepare update data
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        profile_image: imageUrl,
        // For school users, update bio with school description
        ...(profile?.user_type === 'school' && {
          bio: formData.school_description,
          school_name: formData.school_name
        })
      };

      // Update profile via auth context
      const result = await updateAuthProfile(updateData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSuccess(profile 
        ? 'Profile updated successfully!' 
        : 'Profile created successfully! Welcome to WondasTeach!'
      );
      
      // Redirect to dashboard after successful update
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
    if (profileImage && profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(profileImage);
    }
  };

  const getUserInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase();
    }
    return 'U';
  };

  const formatUserType = (type: string) => {
    switch (type) {
      case 'teacher':
        return 'Teacher';
      case 'school':
        return 'School Administrator';
      case 'parent':
        return 'Parent';
      case 'student':
        return 'Student';
      default:
        return type;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to edit your profile.</p>
              <Button onClick={() => setCurrentPage('login')} className="bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage('dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {profile ? 'Edit Profile' : 'Complete Your Profile'}
              </h1>
              <p className="text-gray-600">
                {profile 
                  ? 'Update your information and preferences'
                  : 'Fill in your information to get started'
                }
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {formatUserType(profile?.user_type || user?.user_metadata?.user_type || 'User')}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-green-100">
                    <AvatarImage src={profileImage || undefined} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {profileImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : 'Choose profile picture'}
                      </span>
                    </div>
                  </Label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a JPEG, PNG, GIF, or WebP image (max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State or Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {(profile?.user_type || user?.user_metadata?.user_type) === 'school' ? 'School Information' : 'Professional Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(profile?.user_type || user?.user_metadata?.user_type) === 'school' ? (
                /* School-specific fields */
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      School Name *
                    </Label>
                    <Input
                      id="schoolName"
                      value={formData.school_name}
                      onChange={(e) => handleInputChange('school_name', e.target.value)}
                      placeholder="e.g., Springfield Elementary School"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolDescription" className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      School Description
                    </Label>
                    <Textarea
                      id="schoolDescription"
                      value={formData.school_description}
                      onChange={(e) => handleInputChange('school_description', e.target.value)}
                      placeholder="Tell us about your school, mission, values, and what makes it special..."
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                /* Teacher-specific bio field */
                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique..."
                    rows={4}
                  />
                </div>
              )}

              {(profile?.user_type || user?.user_metadata?.user_type) === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      Teaching Experience
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Describe your teaching experience, previous positions, achievements..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education" className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Education & Certifications
                    </Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="List your degrees, certifications, and qualifications..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">
                      Skills & Subjects
                    </Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="Math, Science, English, Art, Music (separate with commas)"
                    />
                    <p className="text-xs text-gray-500">
                      Enter subjects and skills separated by commas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">
                      Availability Status
                    </Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => handleInputChange('availability', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Available for new positions
                          </span>
                        </SelectItem>
                        <SelectItem value="not_available">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Not currently seeking positions
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              disabled={loading || imageUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading || imageUploading}
            >
              {loading || imageUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {imageUploading ? 'Uploading Image...' : 'Saving Profile...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}