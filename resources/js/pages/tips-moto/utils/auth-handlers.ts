import { toast } from 'sonner';

// Authentication handler factory
export const createAuthHandlers = (
  setCurrentUser: (user: any) => void,
  setCurrentAdmin: (admin: any) => void,
  setAuthState: (state: 'homepage' | 'userLogin' | 'userSignUp' | 'adminLogin' | 'userDashboard' | 'adminDashboard') => void
) => {
  // Authentication handlers
  const handleUserLogin = (userData: any) => {
    setCurrentUser(userData);
    setAuthState('userDashboard');
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleAdminLogin = (adminData: any) => {
    setCurrentAdmin(adminData);
    setAuthState('adminDashboard');
    toast.success(`Welcome, ${adminData.firstName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAdmin(null);
    setAuthState('homepage');
    toast.success('Logged out successfully');
  };

  // Handle sign in action from homepage
  const handleUserSignIn = () => {
    setAuthState('userLogin');
  };

  // Handle get started action from homepage
  const handleUserGetStarted = () => {
    setAuthState('userSignUp');
  };

  return {
    handleUserLogin,
    handleAdminLogin,
    handleLogout,
    handleUserSignIn,
    handleUserGetStarted
  };
};
