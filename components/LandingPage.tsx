import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star, MapPin, DollarSign, Users } from "lucide-react";

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedTeacher: (teacher: any) => void;
  setSelectedJob: (job: any) => void;
}

export function LandingPage({ setCurrentPage, setSelectedTeacher, setSelectedJob }: LandingPageProps) {
  const stats = [
    { number: "2,847", label: "Active Teachers", color: "bg-green-500" },
    { number: "456", label: "Open Positions", color: "bg-blue-500" },
    { number: "1,234", label: "Students Reached", color: "bg-purple-500" },
    { number: "98%", label: "Success Rate", color: "bg-orange-500" }
  ];

  const jobs = [
    {
      id: 1,
      title: "Elementary Math Teacher",
      school: "Ubuntu Primary School",
      location: "Cape Town, South Africa",
      salary: "$45,000 - $55,000",
      hours: "2 hours ago",
      type: "URGENT",
      description: "We are seeking a passionate Elementary Math Teacher to join our dynamic team. The ideal candidate will have experience in creating engaging lesson plans and fostering a positive learning environment for students aged 6-12.",
      requirements: [
        "Bachelor's degree in Education or Mathematics",
        "3+ years of elementary teaching experience",
        "Strong classroom management skills",
        "Excellent communication abilities",
        "Familiarity with modern teaching technologies"
      ],
      benefits: [
        "Competitive salary package",
        "Health insurance coverage",
        "Professional development opportunities",
        "Supportive work environment",
        "Summer vacation paid leave"
      ],
      schoolInfo: {
        established: "1995",
        students: "450+",
        teachers: "32",
        rating: "4.7/5"
      }
    },
    {
      id: 2,
      title: "High School Biology Teacher",
      school: "Makererere International School",
      location: "Kampala, Uganda",
      salary: "$35,000 - $45,000",
      hours: "5 hours ago",
      description: "Looking for an experienced Biology teacher to inspire and educate high school students in life sciences.",
      requirements: [
        "Bachelor's degree in Biology or related field",
        "Teaching certification",
        "2+ years of high school teaching experience"
      ],
      benefits: [
        "Health insurance",
        "Professional development",
        "Research opportunities"
      ],
      schoolInfo: {
        established: "2001",
        students: "800+",
        teachers: "45",
        rating: "4.5/5"
      }
    },
    {
      id: 3,
      title: "English Literature Teacher",
      school: "Victoria Island Academy",
      location: "Lagos, Nigeria",
      salary: "$40,000 - $50,000",
      hours: "1 day ago",
      description: "Seeking a passionate English Literature teacher to join our prestigious academy.",
      requirements: [
        "Master's degree in English Literature",
        "5+ years of teaching experience",
        "Experience with Cambridge curriculum"
      ],
      benefits: [
        "Competitive salary",
        "International environment",
        "Career advancement opportunities"
      ],
      schoolInfo: {
        established: "1987",
        students: "600+",
        teachers: "38",
        rating: "4.8/5"
      }
    }
  ];

  const featuredTeachers = [
    {
      id: 1,
      name: "Amara Olufot",
      subject: "Mathematics",
      experience: "5 years experience",
      location: "Abuja, Nigeria",
      rating: 4.8,
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
    },
    {
      id: 2,
      name: "Kemi Adebayo",
      subject: "Computer Science",
      experience: "3 years experience",
      location: "Lagos, Nigeria",
      rating: 4.9,
      bio: "Innovative computer science educator specializing in programming and digital literacy for students of all ages.",
      education: [
        { degree: "Bachelor of Science in Computer Science", institution: "University of Lagos", year: "2020" }
      ],
      certifications: ["Microsoft Certified Educator", "Python Programming Specialist"],
      specializations: ["Python", "Web Development", "Data Science", "AI Fundamentals"],
      languages: ["English", "Yoruba"],
      achievements: [
        "Developed coding curriculum for 5 schools",
        "Student competition winner mentor"
      ],
      availability: "Full-time, Weekend workshops available",
      hourlyRate: "$30-40/hour",
      totalStudents: 187,
      successRate: "98%",
      contact: {
        email: "kemi.adebayo@email.com",
        phone: "+234-802-345-6789",
        website: "www.kemicodes.com"
      }
    },
    {
      id: 3,
      name: "Fatima El-Mahmoud",
      subject: "French Literature",
      experience: "7 years experience",
      location: "Casablanca, Morocco",
      rating: 4.7,
      bio: "Experienced French literature teacher with expertise in classical and contemporary works.",
      education: [
        { degree: "Master of Arts in French Literature", institution: "Mohammed V University", year: "2016" }
      ],
      certifications: ["DELF/DALF Examiner", "International Baccalaureate Certified"],
      specializations: ["Classical Literature", "Modern French", "IB French", "AP French"],
      languages: ["French", "Arabic", "English"],
      achievements: [
        "IB French program coordinator",
        "Published research on Francophone literature"
      ],
      availability: "Full-time",
      hourlyRate: "$35-45/hour",
      totalStudents: 156,
      successRate: "94%",
      contact: {
        email: "fatima.mahmoud@email.com",
        phone: "+212-661-234-567",
        website: "www.frenchlitacademy.ma"
      }
    }
  ];

  const handleApplyToJob = (job: any) => {
    setSelectedJob(job);
    setCurrentPage('application');
  };

  const handleViewTeacherProfile = (teacher: any) => {
    setSelectedTeacher(teacher);
    setCurrentPage('teacher-profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl mb-4">Connect. Teach. Grow Together.</h1>
            <p className="text-xl mb-8 text-green-100">
              Join the largest community of educators and schools. Find your perfect teaching position or 
              discover exceptional talent for your institution.
            </p>
            <div className="flex items-center space-x-4">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8"
              >
                I'm a Teacher
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600 px-8"
              >
                I'm a School
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className={`w-16 h-16 ${stat.color} rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-2xl`}>
                  {stat.number}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Teaching Opportunities */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Latest Teaching Opportunities</h2>
              <Button variant="link" className="text-green-600">View All Jobs</Button>
            </div>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{job.title}</h3>
                          {job.type && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              {job.type}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.school}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary}
                          </span>
                          <span>{job.hours}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleApplyToJob(job)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Teachers */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Featured Teachers</h2>
              <Button variant="link" className="text-green-600">Browse All Teachers</Button>
            </div>
            <div className="space-y-4">
              {featuredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">{teacher.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm">{teacher.name}</h4>
                        <p className="text-xs text-gray-600">{teacher.subject}</p>
                        <p className="text-xs text-gray-500">{teacher.experience}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{teacher.rating} rating</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleViewTeacherProfile(teacher)}
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-3 text-xs"
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}