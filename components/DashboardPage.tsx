import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { dbService, Job, Profile as DBProfile, Application } from "../utils/supabase";
import { SupabaseConnectionStatus } from "./SupabaseConnectionStatus";
import { 
  User, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck
} from "lucide-react";

interface DashboardPageProps {
  setCurrentPage: (page: string) => void;
}

export function DashboardPage({ setCurrentPage }: DashboardPageProps) {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [teachers, setTeachers] = useState<DBProfile[]>([]);
  const [schools, setSchools] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Load jobs
      const jobsData = await dbService.getJobs();
      setJobs(jobsData);

      // Load user applications if user is a teacher
      if (profile?.user_type === 'teacher' && user?.id) {
        const appsData = await dbService.getUserApplications(user.id);
        setApplications(appsData);
      }

      // Load teachers (for schools) or schools (for teachers)
      if (profile?.user_type === 'school') {
        const teachersData = await dbService.getTeachers(6);
        setTeachers(teachersData);
      } else if (profile?.user_type === 'teacher') {
        const schoolsData = await dbService.getSchools(6);
        setSchools(schoolsData);
      }

    } catch (error: any) {
      console.error('Dashboard data loading error:', error);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentPage('landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatUserType = (type: string) => {
    switch (type) {
      case 'teacher':
        return 'Teacher';
      case 'school':
        return 'School Administrator';
      default:
        return type;
    }
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getJoinDate = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
    return 'Recently';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
              <Button onClick={() => setCurrentPage('login')} className="bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where user exists but profile is still loading or missing
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h2 className="text-xl mb-2">Setting up your profile...</h2>
              <p className="text-gray-600 mb-4">
                Please wait while we prepare your personalized dashboard.
              </p>
              <Button 
                variant="outline"
                onClick={() => setCurrentPage('profile-edit')} 
                className="mt-2"
              >
                Complete Profile Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with User Profile */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-16 h-16 border-4 border-green-100">
                  <AvatarImage src={profile?.profile_image || undefined} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-lg font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* User Info */}
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      <UserCheck className="w-3 h-3 mr-1" />
                      {formatUserType(profile?.user_type)}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Member since {getJoinDate()}
                    </span>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Alpha Testing
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage('profile-edit')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="mb-6">
          <SupabaseConnectionStatus />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="community">
              {profile?.user_type === 'school' ? 'Teachers' : 'Schools'}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome back, {profile?.first_name}! 👋
                    </h2>
                    <p className="text-gray-600">
                      {profile?.user_type === 'teacher' 
                        ? "Ready to find your next teaching opportunity?" 
                        : "Ready to find amazing teachers for your school?"
                      }
                    </p>
                  </div>
                  <div className="text-4xl">
                    {profile?.user_type === 'teacher' ? '🎓' : '🏫'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Available positions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">My Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Applications submitted
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Account Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Profile verified
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {profile?.user_type === 'teacher' && (
                  <>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setCurrentPage('browse-schools')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Schools
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentPage('profile-edit')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
                {profile?.user_type === 'school' && (
                  <>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setCurrentPage('job-post')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentPage('browse-teachers')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Browse Teachers
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage('profile-edit')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Available Jobs</h2>
              <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No jobs available</h3>
                    <p className="text-gray-600">Check back later for new opportunities!</p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <Badge variant="secondary">
                              {job.employment_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {job.school?.school_logo && (
                              <img 
                                src={job.school.school_logo} 
                                alt="School logo" 
                                className="w-5 h-5 rounded object-cover" 
                              />
                            )}
                            <p className="text-gray-600">
                              {job.school?.school_name || `${job.school?.first_name} ${job.school?.last_name}`}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </p>
                            {job.salary_range && <p>💰 {job.salary_range}</p>}
                            <p>🕒 Posted {new Date(job.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">My Applications</h2>
              <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No applications yet</h3>
                    <p className="text-gray-600">Start applying to jobs to see them here!</p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {application.job?.title || 'Job Application'}
                            </h3>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              <Badge variant={
                                application.status === 'accepted' ? 'default' :
                                application.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {application.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Applied on {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">Application ID: {application.id.slice(0, 8)}...</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Application
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">
                {profile?.user_type === 'school' ? 'Available Teachers' : 'Registered Schools'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(profile?.user_type === 'school' ? 'browse-teachers' : 'browse-schools')}
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile?.user_type === 'school' ? (
                teachers.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="pt-6 text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No Teachers Yet</h3>
                      <p className="text-gray-600">Check back later for new teacher profiles!</p>
                    </CardContent>
                  </Card>
                ) : (
                  teachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-green-100">
                            <AvatarImage src={teacher.profile_image || undefined} />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{teacher.first_name} {teacher.last_name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                teacher.availability === 'available' ? 'bg-green-500' :
                                teacher.availability === 'not_available' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></div>
                              <span className="text-xs text-gray-600 capitalize">
                                {teacher.availability === 'not_available' ? 'not available' : teacher.availability || 'available'}
                              </span>
                            </div>
                            {teacher.location && (
                              <p className="text-xs text-gray-500 mt-1">{teacher.location}</p>
                            )}
                            {teacher.skills && teacher.skills.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {teacher.skills.slice(0, 2).map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {teacher.skills.length > 2 && (
                                    <span className="text-xs text-gray-500">+{teacher.skills.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              ) : (
                schools.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="pt-6 text-center">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No Schools Yet</h3>
                      <p className="text-gray-600">Check back later for new school registrations!</p>
                    </CardContent>
                  </Card>
                ) : (
                  schools.map((school) => (
                    <Card key={school.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-green-100">
                            <AvatarImage src={school.school_logo || undefined} />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {school.school_name?.[0] || school.first_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">
                              {school.school_name || `${school.first_name} ${school.last_name}`}
                            </h4>
                            {school.location && (
                              <p className="text-xs text-gray-500 mt-1">{school.location}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs text-gray-600">Active</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Platform Analytics</h2>
              <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Open positions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Teachers</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teachers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered teachers
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Schools</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schools.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active schools
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Your applications
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <p className="text-sm text-gray-600">
                      Platform is running in {loading ? 'loading...' : 'active'} mode. 
                      All features are fully functional.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Your Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Profile Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}