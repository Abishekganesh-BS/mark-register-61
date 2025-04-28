
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/auth";
import { createAdminSession } from "./useAdminSession";
import { User, Session } from "@supabase/supabase-js";

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    setProfile(data as Profile);
  };

  const login = async (username: string, password: string) => {
    try {
      // Special case for admin login
      if (username === 'admin' && password === 'admin') {
        const { user: adminUser, profile: adminProfile, session: adminSession } = createAdminSession();
        setUser(adminUser);
        setProfile(adminProfile);
        setSession(adminSession);
        
        // Store in localStorage for persistence
        localStorage.setItem('admin-session', JSON.stringify({
          user: adminUser,
          profile: adminProfile,
          session: adminSession,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        toast.success('Admin login successful');
        navigate('/dashboard');
        return;
      }
      
      // Regular user login
      const email = `${username}@mark-register.internal`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Successfully logged in');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      // Prevent creating admin account through regular signup
      if (username === 'admin') {
        toast.error('Username "admin" is reserved');
        return;
      }
      
      const email = `${username}@mark-register.internal`;
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success('Registration successful!');
      } else {
        toast.error('Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if we're using the mock admin session
      if (profile?.username === 'admin' && localStorage.getItem('admin-session')) {
        // Clear admin session
        localStorage.removeItem('admin-session');
        setUser(null);
        setSession(null);
        setProfile(null);
        toast.success('Successfully logged out');
        navigate('/login');
        return;
      }
      
      // Regular logout for Supabase users
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  return {
    user,
    setUser,
    session,
    setSession,
    profile,
    setProfile,
    fetchProfile,
    login,
    signup,
    logout
  };
};
