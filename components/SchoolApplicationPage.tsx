import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ChevronLeft, MapPin, DollarSign, Calendar, Upload, Building, Users, Clock, Award } from "lucide-react";

interface SchoolApplicationPageProps {
  job: any;
  setCurrentPage: (page: string) => void;
}

export function SchoolApplicationPage({ job, setCurrentPage }: SchoolApplicationPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    experience: "",
    education: "",
    certifications: "",
    availability: "",
    expectedSalary: "",
    startDate: "",
    references: "",
    portfolio: "",
    additionalInfo: ""
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Default job data if none provided
  const jobData = job || {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    // In a real app, this would submit the application
    console.log("Application submitted:", formData);
    alert("Application submitted successfully!");
    setCurrentPage('landing');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <Badge variant={jobData.type === 'URGENT' ? 'destructive' : 'secondary'}>
            {jobData.type || 'Open Position'}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Position</CardTitle>
                <p className="text-gray-600">Complete the form below to submit your application</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Cover Letter */}
                  <div>
                    <h3 className="text-lg mb-4">Cover Letter</h3>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Why are you interested in this position? *</Label>
                      <Textarea
                        id="coverLetter"
                        rows={5}
                        placeholder="Tell us about your passion for teaching and why you'd be a great fit for this role..."
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Background */}
                  <div>
                    <h3 className="text-lg mb-4">Professional Background</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Teaching Experience *</Label>
                        <Textarea
                          id="experience"
                          rows={4}
                          placeholder="Describe your teaching experience, including years taught, age groups, and subjects..."
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education Background *</Label>
                        <Textarea
                          id="education"
                          rows={3}
                          placeholder="List your degrees, certifications, and relevant educational background..."
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certifications">Additional Certifications</Label>
                        <Textarea
                          id="certifications"
                          rows={2}
                          placeholder="Any additional teaching certifications or professional development..."
                          value={formData.certifications}
                          onChange={(e) => handleInputChange('certifications', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Availability & Salary */}
                  <div>
                    <h3 className="text-lg mb-4">Availability & Expectations</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Select onValueChange={(value) => handleInputChange('availability', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="substitute">Substitute</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Available Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="expectedSalary">Expected Salary Range</Label>
                      <Input
                        id="expectedSalary"
                        placeholder="e.g., $45,000 - $55,000"
                        value={formData.expectedSalary}
                        onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg mb-4">Additional Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="references">References</Label>
                        <Textarea
                          id="references"
                          rows={3}
                          placeholder="Provide 2-3 professional references with contact information..."
                          value={formData.references}
                          onChange={(e) => handleInputChange('references', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input
                          id="portfolio"
                          placeholder="Link to your teaching portfolio or website"
                          value={formData.portfolio}
                          onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Comments</Label>
                        <Textarea
                          id="additionalInfo"
                          rows={3}
                          placeholder="Any additional information you'd like to share..."
                          value={formData.additionalInfo}
                          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <Label>Resume Upload</Label>
                    <div className="mt-2 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Drop your resume here or click to upload</p>
                      <p className="text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                      <Button type="button" variant="outline" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I agree to the processing of my personal data for recruitment purposes and confirm that all information provided is accurate.
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!agreedToTerms}
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Job Details Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{jobData.title}</CardTitle>
                <p className="text-green-600">{jobData.school}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{jobData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{jobData.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Posted {jobData.hours}</span>
                </div>
              </CardContent>
            </Card>

            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Established</span>
                  <span>{jobData.schoolInfo.established}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Students</span>
                  <span>{jobData.schoolInfo.students}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teaching Staff</span>
                  <span>{jobData.schoolInfo.teachers}</span>
                </div>
                <div className="flex justify-between">
                  <span>School Rating</span>
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-yellow-400" />
                    {jobData.schoolInfo.rating}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobData.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobData.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{benefit}</span>
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