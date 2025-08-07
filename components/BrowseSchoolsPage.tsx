import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/supabase/client";
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  Building,
  Users,
  Star,
  Filter,
  Eye,
  MessageCircle,
  Briefcase
} from "lucide-react";

interface BrowseSchoolsPageProps {
  setCurrentPage: (page: string) => void;
}

export function BrowseSchoolsPage({ setCurrentPage }: BrowseSchoolsPageProps) {
  const { user, profile } = useAuth();
  const [schools, setSchools] = useState([]);
  const [schoolJobs, setSchoolJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setLoading(true);
    setError('');

    try {
      const [schoolsResult, jobsResult] = await Promise.all([
        api.getSchools(),
        api.getJobs()
      ]);
      
      if (schoolsResult.error) {
        throw new Error(schoolsResult.error);
      }
      
      setSchools(schoolsResult.schools || []);
      
      // Group jobs by school
      if (jobsResult.jobs) {
        const jobsBySchool = {};
        jobsResult.jobs.forEach(job => {
          if (!jobsBySchool[job.schoolId]) {
            jobsBySchool[job.schoolId] = [];
          }
          jobsBySchool[job.schoolId].push(job);
        });
        setSchoolJobs(jobsBySchool);
      }
      
    } catch (error: any) {
      console.error('Load schools error:', error);
      setError('Failed to load schools: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school => {
    const schoolDisplayName = school.schoolName || `${school.firstName} ${school.lastName}`;
    const matchesSearch = !searchTerm || 
      schoolDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${school.firstName} ${school.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to browse schools.</p>
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
              <h1 className="text-xl font-semibold">Browse Schools</h1>
              <p className="text-gray-600">Discover schools looking for teachers</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {filteredSchools.length} Schools Found
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by school name, administrator, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading schools...</p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Schools Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'No schools have registered yet. Check back later!'
                }
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => {
              const jobs = schoolJobs[school.id] || [];
              const activeJobs = jobs.filter(job => job.status === 'active');

              return (
                <Card key={school.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12 border-2 border-blue-100">
                        <AvatarImage src={school.schoolLogo || school.profileImage || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {school.schoolName 
                            ? `${school.schoolName[0]}${school.schoolName.split(' ')[1]?.[0] || ''}`.toUpperCase()
                            : `${school.firstName?.[0]}${school.lastName?.[0]}`.toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          {school.schoolName || `${school.firstName} ${school.lastName}`}
                        </CardTitle>
                        {school.schoolName ? (
                          <p className="text-sm text-gray-600">
                            Administrator: {school.firstName} {school.lastName}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">School Administrator</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {school.bio && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {school.bio}
                      </p>
                    )}

                    <div className="space-y-2">
                      {school.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {school.location}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {activeJobs.length} Active Job{activeJobs.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {activeJobs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Recent Job Postings:</p>
                        <div className="space-y-1">
                          {activeJobs.slice(0, 2).map((job, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {job.title}
                            </div>
                          ))}
                          {activeJobs.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{activeJobs.length - 2} more position{activeJobs.length - 2 !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View School
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>

                    {activeJobs.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      >
                        View {activeJobs.length} Job{activeJobs.length !== 1 ? 's' : ''}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}