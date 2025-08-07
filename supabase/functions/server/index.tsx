import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/middleware';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));
app.use('*', logger((message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
}));

// Handle preflight requests
app.options('*', (c) => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
});

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage bucket
const initializeStorage = async () => {
  const bucketName = 'make-de6c720d-profiles';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log(`Created storage bucket: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Health check endpoint
app.get('/make-server-de6c720d/health', (c) => {
  console.log('Health check requested');
  return c.json({ 
    status: 'healthy', 
    service: 'WondasTeach API Server',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime ? process.uptime() : 'unknown'
  });
});

// User signup endpoint
app.post('/make-server-de6c720d/auth/signup', async (c) => {
  try {
    console.log('Signup request received');
    
    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    console.log('Signup request data:', { ...body, password: '[REDACTED]' });
    
    const { email, password, firstName, lastName, userType, phone, schoolName, schoolDescription } = body;

    if (!email || !password || !firstName || !lastName || !userType) {
      console.log('Missing required fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName, userType: !!userType });
      return c.json({ error: 'Missing required fields: email, password, firstName, lastName, userType' }, 400);
    }

    // Additional validation for school administrators
    if (userType === 'school' && !schoolName?.trim()) {
      return c.json({ error: 'School name is required for school administrators' }, 400);
    }

    // Check if user already exists first
    const existingProfile = await kv.getByPrefix(`profile:`);
    const userExists = existingProfile.some(item => 
      item.value && item.value.email && item.value.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      console.log('User already exists:', email);
      return c.json({ 
        error: 'A user with this email address has already been registered. Please try signing in instead.' 
      }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName, 
        lastName, 
        userType, 
        phone: phone || '',
        name: `${firstName} ${lastName}`
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Supabase auth signup error:', error);
      
      // Handle specific Supabase errors
      if (error.message.includes('User already registered')) {
        return c.json({ 
          error: 'A user with this email address has already been registered. Please try signing in instead.' 
        }, 400);
      }
      
      if (error.message.includes('Password should be')) {
        return c.json({ 
          error: 'Password does not meet requirements. Please use at least 6 characters.' 
        }, 400);
      }
      
      return c.json({ error: error.message }, 400);
    }

    // Store profile in KV store
    const profileData = {
      id: data.user.id,
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
      schoolName: userType === 'school' ? schoolName : undefined,
      schoolLogo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${data.user.id}`, profileData);
    
    console.log('User created successfully:', data.user.id);
    return c.json({ 
      success: true, 
      user: data.user,
      profile: profileData
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    return c.json({ 
      error: 'Internal server error during signup',
      details: error.message 
    }, 500);
  }
});

// Get user profile
app.get('/make-server-de6c720d/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-de6c720d/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateData = await c.req.json();
    const existingProfile = await kv.get(`profile:${userId}`);
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Update profile
    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${userId}`, updatedProfile);
    
    return c.json({ profile: updatedProfile });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Upload profile image
app.post('/make-server-de6c720d/profile/:userId/upload-image', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Check file size (5MB limit)
    if (file.size > 5242880) {
      return c.json({ error: 'File size must be less than 5MB' }, 400);
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-de6c720d-profiles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload image' }, 500);
    }

    // Get signed URL
    const { data: signedUrlData } = await supabase.storage
      .from('make-de6c720d-profiles')
      .createSignedUrl(fileName, 31536000); // 1 year expiry

    // Update profile with image URL
    const existingProfile = await kv.get(`profile:${userId}`);
    if (existingProfile) {
      const updatedProfile = {
        ...existingProfile,
        profileImage: signedUrlData?.signedUrl || null,
        profileImagePath: fileName,
        updatedAt: new Date().toISOString()
      };
      await kv.set(`profile:${userId}`, updatedProfile);
    }

    return c.json({ 
      success: true, 
      imageUrl: signedUrlData?.signedUrl,
      imagePath: fileName
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Get all teachers (for schools to browse)
app.get('/make-server-de6c720d/teachers', async (c) => {
  try {
    const profiles = await kv.getByPrefix('profile:');
    const teachers = profiles
      .filter(item => item.value?.userType === 'teacher')
      .map(item => ({
        ...item.value,
        // Generate fresh signed URLs for profile images
        profileImage: item.value.profileImagePath ? null : item.value.profileImage
      }));

    // Generate fresh signed URLs for images
    const teachersWithImages = await Promise.all(
      teachers.map(async (teacher) => {
        if (teacher.profileImagePath) {
          const { data: signedUrlData } = await supabase.storage
            .from('make-de6c720d-profiles')
            .createSignedUrl(teacher.profileImagePath, 3600); // 1 hour expiry
          
          return {
            ...teacher,
            profileImage: signedUrlData?.signedUrl || null
          };
        }
        return teacher;
      })
    );

    return c.json({ teachers: teachersWithImages });
  } catch (error: any) {
    console.error('Get teachers error:', error);
    return c.json({ error: 'Failed to get teachers' }, 500);
  }
});

// Get all schools (for teachers to browse)
app.get('/make-server-de6c720d/schools', async (c) => {
  try {
    const profiles = await kv.getByPrefix('profile:');
    const schools = profiles
      .filter(item => item.value?.userType === 'school')
      .map(item => ({
        ...item.value,
        profileImage: item.value.profileImagePath ? null : item.value.profileImage
      }));

    // Generate fresh signed URLs for images
    const schoolsWithImages = await Promise.all(
      schools.map(async (school) => {
        if (school.profileImagePath) {
          const { data: signedUrlData } = await supabase.storage
            .from('make-de6c720d-profiles')
            .createSignedUrl(school.profileImagePath, 3600);
          
          return {
            ...school,
            profileImage: signedUrlData?.signedUrl || null
          };
        }
        return school;
      })
    );

    return c.json({ schools: schoolsWithImages });
  } catch (error: any) {
    console.error('Get schools error:', error);
    return c.json({ error: 'Failed to get schools' }, 500);
  }
});

// Create job posting (for schools)
app.post('/make-server-de6c720d/jobs', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is a school
    const userProfile = await kv.get(`profile:${user.id}`);
    if (!userProfile || userProfile.userType !== 'school') {
      return c.json({ error: 'Only schools can post jobs' }, 403);
    }

    const jobData = await c.req.json();
    const { title, description, requirements, salary, location, type, subjects } = jobData;

    if (!title || !description || !location) {
      return c.json({ error: 'Missing required fields: title, description, location' }, 400);
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job = {
      id: jobId,
      title,
      description,
      requirements: requirements || '',
      salary: salary || '',
      location,
      type: type || 'full-time',
      subjects: subjects || [],
      schoolId: user.id,
      school: userProfile.schoolName || `${userProfile.firstName} ${userProfile.lastName}`,
      schoolEmail: userProfile.email,
      schoolLogo: userProfile.schoolLogo || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`job:${jobId}`, job);
    
    return c.json({ success: true, job });
  } catch (error: any) {
    console.error('Create job error:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

// Get all jobs
app.get('/make-server-de6c720d/jobs', async (c) => {
  try {
    const jobs = await kv.getByPrefix('job:');
    const activeJobs = jobs
      .filter(item => item.value?.status === 'active')
      .map(item => item.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ jobs: activeJobs });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    return c.json({ error: 'Failed to get jobs' }, 500);
  }
});

// Get jobs posted by a specific school
app.get('/make-server-de6c720d/jobs/school/:schoolId', async (c) => {
  try {
    const schoolId = c.req.param('schoolId');
    const jobs = await kv.getByPrefix('job:');
    const schoolJobs = jobs
      .filter(item => item.value?.schoolId === schoolId)
      .map(item => item.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ jobs: schoolJobs });
  } catch (error: any) {
    console.error('Get school jobs error:', error);
    return c.json({ error: 'Failed to get school jobs' }, 500);
  }
});

// Apply to job
app.post('/make-server-de6c720d/jobs/:jobId/apply', async (c) => {
  try {
    const jobId = c.req.param('jobId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is a teacher
    const userProfile = await kv.get(`profile:${user.id}`);
    if (!userProfile || userProfile.userType !== 'teacher') {
      return c.json({ error: 'Only teachers can apply to jobs' }, 403);
    }

    // Get job details
    const job = await kv.get(`job:${jobId}`);
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    const applicationData = await c.req.json();
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const application = {
      id: applicationId,
      jobId,
      jobTitle: job.title,
      schoolId: job.schoolId,
      teacherId: user.id,
      teacherName: `${userProfile.firstName} ${userProfile.lastName}`,
      teacherEmail: userProfile.email,
      coverLetter: applicationData.coverLetter || '',
      additionalInfo: applicationData.additionalInfo || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`application:${applicationId}`, application);
    
    return c.json({ success: true, application });
  } catch (error: any) {
    console.error('Job application error:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Get user applications
app.get('/make-server-de6c720d/applications/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Verify user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const applications = await kv.getByPrefix('application:');
    const userApplications = applications
      .filter(item => item.value?.teacherId === userId)
      .map(item => item.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ applications: userApplications });
  } catch (error: any) {
    console.error('Get user applications error:', error);
    return c.json({ error: 'Failed to get applications' }, 500);
  }
});

// Analytics endpoint
app.get('/make-server-de6c720d/analytics', async (c) => {
  try {
    const profiles = await kv.getByPrefix('profile:');
    const jobs = await kv.getByPrefix('job:');
    const applications = await kv.getByPrefix('application:');

    const teachers = profiles.filter(item => item.value?.userType === 'teacher').length;
    const schools = profiles.filter(item => item.value?.userType === 'school').length;
    const totalUsers = profiles.length;
    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    return c.json({
      analytics: {
        totalUsers,
        teachers,
        schools,
        totalJobs,
        totalApplications,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return c.json({ error: 'Failed to get analytics' }, 500);
  }
});

// Global error handler
app.onError((err, c) => {
  console.error('Global error handler:', err);
  console.error('Error stack:', err.stack);
  return c.json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler
app.notFound((c) => {
  console.log('404 - Route not found:', c.req.url);
  return c.json({ 
    error: 'Route not found',
    path: c.req.url,
    method: c.req.method,
    availableRoutes: [
      'GET /make-server-de6c720d/health',
      'POST /make-server-de6c720d/auth/signup',
      'GET /make-server-de6c720d/profile/:userId',
      'PUT /make-server-de6c720d/profile/:userId',
      'POST /make-server-de6c720d/profile/:userId/upload-image',
      'GET /make-server-de6c720d/teachers',
      'GET /make-server-de6c720d/schools',
      'GET /make-server-de6c720d/jobs',
      'POST /make-server-de6c720d/jobs',
      'POST /make-server-de6c720d/jobs/:jobId/apply',
      'GET /make-server-de6c720d/applications/user/:userId',
      'GET /make-server-de6c720d/analytics'
    ]
  }, 404);
});

// Initialize storage on startup
console.log('Starting WondasTeach API Server...');
initializeStorage();

console.log('Server ready to handle requests');
Deno.serve(app.fetch);