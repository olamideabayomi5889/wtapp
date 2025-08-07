import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { UserFlowPage } from "./components/UserFlowPage";
import { TeacherProfilePage } from "./components/TeacherProfilePage";
import { SchoolApplicationPage } from "./components/SchoolApplicationPage";
import { DashboardPage } from "./components/DashboardPage";
import { ProfileEditPage } from "./components/ProfileEditPage";
import { JobPostPage } from "./components/JobPostPage";
import { BrowseTeachersPage } from "./components/BrowseTeachersPage";
import { BrowseSchoolsPage } from "./components/BrowseSchoolsPage";
import { SupabaseSetup } from "./components/SupabaseSetup";
import { getConnectionStatus } from "./utils/supabase";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if we should show the setup page based on URL parameter
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('page') === 'setup') {
        return 'setup';
      }
    }
    return 'landing';
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('dashboard');
    }
  }, [user, loading, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            setCurrentPage={setCurrentPage}
            setSelectedTeacher={setSelectedTeacher}
            setSelectedJob={setSelectedJob}
          />
        );
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'userflow':
        return <UserFlowPage />;
      case 'teacher-profile':
        return (
          <TeacherProfilePage 
            teacher={selectedTeacher}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'application':
        return (
          <SchoolApplicationPage 
            job={selectedJob}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'profile-edit':
        return <ProfileEditPage setCurrentPage={setCurrentPage} />;
      case 'job-post':
        return <JobPostPage setCurrentPage={setCurrentPage} />;
      case 'browse-teachers':
        return <BrowseTeachersPage setCurrentPage={setCurrentPage} />;
      case 'browse-schools':
        return <BrowseSchoolsPage setCurrentPage={setCurrentPage} />;
      case 'setup':
        return <SupabaseSetup />;
      default:
        return (
          <LandingPage 
            setCurrentPage={setCurrentPage}
            setSelectedTeacher={setSelectedTeacher}
            setSelectedJob={setSelectedJob}
          />
        );
    }
  };

  // Show loading screen while authentication is being checked
  if (loading) {
    const status = getConnectionStatus();
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Loading WondasTeach...</h2>
          <p className="text-sm text-gray-600 mb-2">
            Initializing your personalized teacher-school connection platform
          </p>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
            {status.mode === 'supabase' ? '🔗 Connected to Supabase' : '🔧 Running in offline mode'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      
      {renderPage()}
    </div>
  );
}

export default function App() {
  const status = getConnectionStatus();
  
  console.log('%c🎓 WondasTeach Platform Starting', 'background: #10b981; color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;');
  console.log('📱 Modern teacher-school connection platform');
  console.log(`🔗 Mode: ${status.mode} | Connected: ${status.isConnected}`);
  
  if (status.mode === 'mock') {
    console.log('%c🔧 Demo Mode Active', 'background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
    console.log('✅ All features work locally with persistent data during your session');
    console.log('💡 To connect Supabase for production, visit: /setup');
    console.log('📝 Add ?page=setup to your URL to access the setup page');
  }
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}