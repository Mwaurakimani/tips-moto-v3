import { toast } from 'react-hot-toast';
import { router } from '@inertiajs/react';

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
        // 1️⃣ Call Laravel logout
        router.post(route('logout'), {}, {
            onSuccess: () => {
                // 2️⃣ Reset local state after server confirms logout
                setCurrentUser(null);
                setCurrentAdmin(null);
                setAuthState('homepage');
                toast.success('Logged out successfully');
            },
            onError: (errors) => {
                toast.error('Logout failed. Please try again.');
                console.error(errors);
            }
        });
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
