import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Star, MapPin, GraduationCap, Calendar, Award, MessageCircle, Heart, Share2, ChevronLeft, Mail, Phone, Globe, BookOpen, Clock, Users } from "lucide-react";

interface TeacherProfilePageProps {
  teacher: any;
  setCurrentPage: (page: string) => void;
}

export function TeacherProfilePage({ teacher, setCurrentPage }: TeacherProfilePageProps) {
  // Default teacher data if none provided
  const teacherData = teacher || {
    name: "Amara Olufot",
    subject: "Mathematics",
    experience: "5 years experience",
    location: "Abuja, Nigeria",
    rating: 4.8,
    avatar: null,
    bio: "Passionate mathematics educator with a proven track record of helping students excel in algebra, geometry, and calculus. I believe in making complex concepts accessible through innovative teaching methods and personalized attention.",
    education: [
      { degree: "Master of Education in Mathematics", institution: "University of Lagos", year: "2019" },
      { degree: "Bachelor of Science in Mathematics", institution: "Ahmadu Bello University", year: "2017" }
    ],
    certifications: [
      "Certified Secondary Mathematics Teacher",
      "Google for Education Certified Trainer",
      "Cambridge International Examinations Accredited"
    ],
    specializations: ["Algebra", "Geometry", "Calculus", "Statistics", "SAT Math Prep"],
    languages: ["English", "Hausa", "Yoruba"],
    achievements: [
      "Best Teacher Award 2023 - Lagos State Education Board",
      "95% student pass rate in WAEC Mathematics",
      "Developed innovative math curriculum adopted by 15 schools"
    ],
    availability: "Full-time, Part-time tutoring available",
    hourlyRate: "$25-35/hour",
    totalStudents: 234,
    successRate: "96%",
    contact: {
      email: "amara.olufot@email.com",
      phone: "+234-801-234-5678",
      website: "www.amaramath.com"
    }
  };

  const handleContact = () => {
    // In a real app, this would open a messaging interface
    console.log("Opening contact form for:", teacherData.name);
  };

  const handleHire = () => {
    // In a real app, this would open hiring/booking flow
    console.log("Initiating hire process for:", teacherData.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-2xl">
                      {teacherData.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl mb-2">{teacherData.name}</h1>
                    <p className="text-green-600 mb-2">{teacherData.subject} Specialist</p>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {teacherData.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {teacherData.experience}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {teacherData.rating} rating
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{teacherData.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl">{teacherData.totalStudents}</div>
                  <div className="text-gray-600">Students Taught</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl">{teacherData.successRate}</div>
                  <div className="text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl">{teacherData.hourlyRate}</div>
                  <div className="text-gray-600">Hourly Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {teacherData.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-green-500 pl-4">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {teacherData.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <Button onClick={handleHire} className="w-full bg-green-600 hover:bg-green-700 mb-3">
                  Hire Teacher
                </Button>
                <Button onClick={handleContact} variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{teacherData.availability}</p>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-red-500">Unavailable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{teacherData.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{teacherData.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{teacherData.contact.website}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teacherData.languages.map((language: string, index: number) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {teacherData.certifications.map((cert: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{cert}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}