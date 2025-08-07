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
  GraduationCap,
  Briefcase,
  Users,
  Star,
  Filter,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface BrowseTeachersPageProps {
  setCurrentPage: (page: string) => void;
}

export function BrowseTeachersPage({ setCurrentPage }: BrowseTeachersPageProps) {
  const { user, profile } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await api.getTeachers();
      if (result.error) {
        throw new Error(result.error);
      }
      setTeachers(result.teachers || []);
    } catch (error: any) {
      console.error('Load teachers error:', error);
      setError('Failed to load teachers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = (availability: string) => {
    switch (availability) {
      case 'available':
        return {
          label: 'Available',
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          icon: CheckCircle
        };
      case 'partial':
        return {
          label: 'Partially Available',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          icon: Clock
        };
      case 'unavailable':
        return {
          label: 'Not Available',
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: XCircle
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: Clock
        };
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      teacher.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability = availabilityFilter === 'all' || teacher.availability === availabilityFilter;

    return matchesSearch && matchesAvailability;
  });

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to browse teachers.</p>
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
              <h1 className="text-xl font-semibold">Browse Teachers</h1>
              <p className="text-gray-600">Find qualified teachers for your school</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {filteredTeachers.length} Teachers Found
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, subjects, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="partial">Partially Available</option>
              <option value="unavailable">Not Available</option>
            </select>
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
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Teachers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || availabilityFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'No teachers have registered yet. Check back later!'
                }
              </p>
              {(searchTerm || availabilityFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setAvailabilityFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => {
              const availabilityStatus = getAvailabilityStatus(teacher.availability);
              const StatusIcon = availabilityStatus.icon;

              return (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12 border-2 border-green-100">
                        <AvatarImage src={teacher.profileImage || undefined} />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          {teacher.firstName} {teacher.lastName}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 ${availabilityStatus.color} rounded-full`}></div>
                          <span className={`text-xs ${availabilityStatus.textColor}`}>
                            {availabilityStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {teacher.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {teacher.bio}
                      </p>
                    )}

                    <div className="space-y-2">
                      {teacher.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {teacher.location}
                        </div>
                      )}
                      
                      {teacher.experience && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Teaching Experience
                        </div>
                      )}
                      
                      {teacher.education && (
                        <div className="flex items-center text-sm text-gray-500">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Certified Educator
                        </div>
                      )}
                    </div>

                    {teacher.skills && teacher.skills.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Subjects & Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {teacher.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{teacher.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>
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