// Mock server for development/testing when Edge Functions are unavailable
// This provides the same API interface as the real server

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  phone?: string;
  profileImage?: string;
  availability?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  location?: string;
  schoolName?: string;
  schoolLogo?: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  salary?: string;
  location: string;
  type: string;
  subjects?: string[];
  schoolId: string;
  school: string;
  schoolEmail: string;
  schoolLogo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  coverLetter?: string;
  additionalInfo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class MockServer {
  private profiles: Map<string, UserProfile> = new Map();
  private jobs: Map<string, Job> = new Map();
  private applications: Map<string, Application> = new Map();
  private initialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (this.initialized) return;
    
    // Load from localStorage if available
    try {
      const storedProfiles = localStorage.getItem('mock-server-profiles');
      const storedJobs = localStorage.getItem('mock-server-jobs');
      const storedApplications = localStorage.getItem('mock-server-applications');

      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        this.profiles = new Map(Object.entries(profiles));
      }

      if (storedJobs) {
        const jobs = JSON.parse(storedJobs);
        this.jobs = new Map(Object.entries(jobs));
      }

      if (storedApplications) {
        const applications = JSON.parse(storedApplications);
        this.applications = new Map(Object.entries(applications));
      }
    } catch (error) {
      console.warn('Failed to load mock server data from localStorage:', error);
    }

    // Add some sample data if the storage is empty
    if (this.profiles.size === 0 && this.jobs.size === 0) {
      this.addSampleData();
    }

    this.initialized = true;
  }

  private addSampleData() {
    try {
      // Sample school
      const sampleSchoolId = 'school_sample_001';
      const sampleSchool = {
        id: sampleSchoolId,
        email: 'admin@springfield-elementary.edu',
        firstName: 'Principal',
        lastName: 'Skinner',
        userType: 'school',
        phone: '+1-555-SCHOOL',
        profileImage: null,
        availability: 'active',
        bio: 'Springfield Elementary is a welcoming community school dedicated to providing quality education for all students.',
        experience: '',
        education: '',
        skills: [],
        location: 'Springfield, USA',
        schoolName: 'Springfield Elementary School',
        schoolLogo: null,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      };
      this.profiles.set(sampleSchoolId, sampleSchool);

      // Sample teacher
      const sampleTeacherId = 'teacher_sample_001';
      const sampleTeacher = {
        id: sampleTeacherId,
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        userType: 'teacher',
        phone: '+1-555-TEACH',
        profileImage: null,
        availability: 'available',
        bio: 'Passionate educator with 8 years of experience in elementary mathematics and science.',
        experience: '8 years teaching experience in public and private schools',
        education: 'Master of Education from State University, Bachelor of Science in Mathematics',
        skills: ['Mathematics', 'Science', 'Classroom Management', 'Technology Integration'],
        location: 'Springfield, USA',
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-10').toISOString()
      };
      this.profiles.set(sampleTeacherId, sampleTeacher);

      // Sample job posting
      const sampleJobId = 'job_sample_001';
      const sampleJob = {
        id: sampleJobId,
        title: 'Elementary Mathematics Teacher',
        description: 'We are seeking a dedicated elementary mathematics teacher to join our team. The ideal candidate will create engaging lesson plans and foster a love of learning in young students.',
        requirements: 'Bachelor\'s degree in Education or Mathematics, Teaching certification, 2+ years experience preferred',
        salary: '$45,000 - $55,000',
        location: 'Springfield, USA',
        type: 'full-time',
        subjects: ['Mathematics', 'Elementary Education'],
        schoolId: sampleSchoolId,
        school: 'Springfield Elementary School',
        schoolEmail: 'admin@springfield-elementary.edu',
        schoolLogo: null,
        status: 'active',
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString()
      };
      this.jobs.set(sampleJobId, sampleJob);

      this.saveData();
      console.log('📚 Added sample data to demonstrate app features');
    } catch (error) {
      console.warn('Could not add sample data:', error);
    }
  }

  private saveData() {
    try {
      localStorage.setItem('mock-server-profiles', JSON.stringify(Object.fromEntries(this.profiles)));
      localStorage.setItem('mock-server-jobs', JSON.stringify(Object.fromEntries(this.jobs)));
      localStorage.setItem('mock-server-applications', JSON.stringify(Object.fromEntries(this.applications)));
    } catch (error) {
      console.warn('Failed to save mock server data to localStorage:', error);
    }
  }

  async healthCheck() {
    return {
      status: 'healthy',
      service: 'WondasTeach Mock API Server',
      timestamp: new Date().toISOString(),
      version: '1.0.0-mock',
      mode: 'mock'
    };
  }

  async signup(userData: any) {
    const { email, password, firstName, lastName, userType, phone, schoolName, schoolDescription, schoolLogo } = userData;

    if (!email || !password || !firstName || !lastName || !userType) {
      throw new Error('Missing required fields: email, password, firstName, lastName, userType');
    }

    // Check if user already exists
    for (const profile of this.profiles.values()) {
      if (profile.email.toLowerCase() === email.toLowerCase()) {
        throw new Error('A user with this email address has already been registered. Please try signing in instead.');
      }
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    };

    // Handle school logo if provided
    let schoolLogoUrl = null;
    if (schoolLogo && userType === 'school') {
      // Create a blob URL for the logo in mock mode
      schoolLogoUrl = URL.createObjectURL(schoolLogo);
    }

    // Create profile
    const profileData: UserProfile = {
      id: userId,
      email,
      firstName,
      lastName,
      userType,
      phone: phone || '',
      profileImage: null,
      availability: userType === 'teacher' ? 'available' : 'active',
      bio: userType === 'school' ? schoolDescription || '' : '',
      experience: '',
      education: '',
      skills: [],
      location: '',
      schoolName: userType === 'school' ? schoolName || '' : undefined,
      schoolLogo: userType === 'school' ? schoolLogoUrl : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.profiles.set(userId, profileData);
    this.saveData();

    console.log('✅ User and profile created successfully (mock mode)');

    return {
      success: true,
      user,
      profile: profileData
    };
  }

  async getProfile(userId: string) {
    const profile = this.profiles.get(userId);
    if (!profile) {
      // Check if this user exists in any stored profiles by searching all profiles
      const allProfiles = Array.from(this.profiles.values());
      const foundProfile = allProfiles.find(p => p.id === userId || p.email === userId);
      
      if (foundProfile) {
        console.log('✅ Found profile by alternative lookup');
        return { profile: foundProfile };
      }
      
      // Instead of throwing an error, return a null profile for new users
      console.log(`ℹ️ No profile found for user ${userId} - this is normal for new users`);
      return { profile: null };
    }
    return { profile };
  }

  async updateProfile(userId: string, updateData: any) {
    const existingProfile = this.profiles.get(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.profiles.set(userId, updatedProfile);
    this.saveData();

    return { profile: updatedProfile };
  }

  async uploadProfileImage(userId: string, imageFile: File) {
    // Mock image upload - create a blob URL
    const imageUrl = URL.createObjectURL(imageFile);
    const imagePath = `${userId}/profile-${Date.now()}.${imageFile.name.split('.').pop()}`;
    
    return {
      success: true,
      imageUrl,
      imagePath
    };
  }

  async getTeachers() {
    const teachers = Array.from(this.profiles.values())
      .filter(profile => profile.userType === 'teacher');
    return { teachers };
  }

  async getSchools() {
    const schools = Array.from(this.profiles.values())
      .filter(profile => profile.userType === 'school');
    return { schools };
  }

  async getJobs() {
    const jobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { jobs };
  }

  async createJob(jobData: any, schoolId: string) {
    const school = this.profiles.get(schoolId);
    if (!school || school.userType !== 'school') {
      throw new Error('Only schools can post jobs');
    }

    const { title, description, requirements, salary, location, type, subjects } = jobData;

    if (!title || !description || !location) {
      throw new Error('Missing required fields: title, description, location');
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: Job = {
      id: jobId,
      title,
      description,
      requirements: requirements || '',
      salary: salary || '',
      location,
      type: type || 'full-time',
      subjects: subjects || [],
      schoolId,
      school: school.schoolName || `${school.firstName} ${school.lastName}`,
      schoolEmail: school.email,
      schoolLogo: school.schoolLogo,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.jobs.set(jobId, job);
    this.saveData();

    return { success: true, job };
  }

  async getSchoolJobs(schoolId: string) {
    const jobs = Array.from(this.jobs.values())
      .filter(job => job.schoolId === schoolId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { jobs };
  }

  async submitApplication(jobId: string, applicationData: any, teacherId: string) {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const teacher = this.profiles.get(teacherId);
    if (!teacher || teacher.userType !== 'teacher') {
      throw new Error('Only teachers can apply to jobs');
    }

    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application: Application = {
      id: applicationId,
      jobId,
      jobTitle: job.title,
      schoolId: job.schoolId,
      teacherId,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      teacherEmail: teacher.email,
      coverLetter: applicationData.coverLetter || '',
      additionalInfo: applicationData.additionalInfo || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.applications.set(applicationId, application);
    this.saveData();

    return { success: true, application };
  }

  async getUserApplications(userId: string) {
    const applications = Array.from(this.applications.values())
      .filter(app => app.teacherId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { applications };
  }

  async getAnalytics() {
    const profiles = Array.from(this.profiles.values());
    const teachers = profiles.filter(p => p.userType === 'teacher').length;
    const schools = profiles.filter(p => p.userType === 'school').length;
    const totalUsers = profiles.length;
    const totalJobs = this.jobs.size;
    const totalApplications = this.applications.size;

    return {
      analytics: {
        totalUsers,
        teachers,
        schools,
        totalJobs,
        totalApplications,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export const mockServer = new MockServer();