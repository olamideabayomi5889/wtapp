import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "../contexts/AuthContext";
import { dbService } from "../utils/supabase";
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  DollarSign, 
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar
} from "lucide-react";

interface JobPostPageProps {
  setCurrentPage: (page: string) => void;
}

export function JobPostPage({ setCurrentPage }: JobPostPageProps) {
  const { user, profile, session } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    location: '',
    employment_type: 'full-time',
    subject: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('You must be logged in to post a job');
      return;
    }

    if (profile?.user_type !== 'school') {
      setError('Only school administrators can post jobs');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare job data
      const jobData = {
        school_id: user.id,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        location: formData.location,
        salary_range: formData.salary_range || undefined,
        employment_type: formData.employment_type as 'full-time' | 'part-time' | 'contract',
        subject: formData.subject || undefined,
        posted_date: new Date().toISOString().split('T')[0],
        status: 'open' as const
      };

      // Create job via database service
      const result = await dbService.createJob(jobData);
      
      setSuccess('Job posted successfully! Teachers can now see and apply to this position.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        requirements: '',
        salary_range: '',
        location: '',
        employment_type: 'full-time',
        subject: ''
      });

      // Redirect to dashboard after successful post
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 3000);

    } catch (error: any) {
      console.error('Job post error:', error);
      setError(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to post a job.</p>
              <Button onClick={() => setCurrentPage('login')} className="bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile.user_type !== 'school') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-4">Only school administrators can post jobs.</p>
              <Button onClick={() => setCurrentPage('dashboard')} className="bg-green-600 hover:bg-green-700">
                Back to Dashboard
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
              <h1 className="text-xl font-semibold">Post a New Job</h1>
              <p className="text-gray-600">Find the perfect teacher for your school</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            School Administrator
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
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., High School Mathematics Teacher"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value) => handleInputChange('employment_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range" className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Salary Range
                </Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange('salary_range', e.target.value)}
                  placeholder="e.g., $45,000 - $65,000 per year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Primary Subject/Area
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="e.g., Mathematics, Science, English"
                />
                <p className="text-xs text-gray-500">
                  Main subject or teaching area for this position
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, school culture, and what makes this position special..."
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500">
                  Be detailed about the role, school environment, and what you're looking for in a candidate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">
                  Requirements & Qualifications
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Required education, certifications, experience, skills...&#10;Each requirement on a new line"
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  List required qualifications, certifications, and preferred experience (one per line)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                About Your School
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {profile.school_logo || profile.profile_image ? (
                      <img 
                        src={profile.school_logo || profile.profile_image} 
                        alt={profile.school_name || 'School logo'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-700 font-medium text-lg">
                        {profile.school_name?.[0] || profile.first_name?.[0]}{profile.school_name?.split(' ')[1]?.[0] || profile.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-lg">
                      {profile.school_name || `${profile.first_name} ${profile.last_name}`}
                    </h4>
                    {profile.school_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        Administrator: {profile.first_name} {profile.last_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    {profile.location && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>
                {profile.bio && (
                  <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-700">{profile.bio}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                This information will be visible to teachers who view your job posting
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting Job...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}