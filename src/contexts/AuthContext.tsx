
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'hod' | 'staff';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      // Special case for admin login
      if (username === 'admin' && password === 'admin') {
        // Create a mock session and user for admin
        const mockAdminId = 'admin-user-id';
        
        // Create a proper mock User object that matches the expected type
        const mockAdminUser = {
          id: mockAdminId,
          email: 'admin@mark-register.internal',
          user_metadata: { username: 'admin' },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          role: '',
          updated_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          factors: null,
          phone: '',
          phone_confirmed_at: null
        } as User; // Use type assertion to ensure it matches the User type
        
        // Set user and session manually for admin
        setUser(mockAdminUser);
        
        // Create a mock admin profile
        const adminProfile: Profile = {
          id: mockAdminId,
          username: 'admin',
          role: 'admin'
        };
        setProfile(adminProfile);
        
        // Create a timestamp for session expiry (24 hours from now)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        
        // Create a mock session
        const mockSession = {
          access_token: 'mock-admin-token',
          refresh_token: 'mock-admin-refresh',
          user: mockAdminUser,
          expires_at: Math.floor(expiryTime.getTime() / 1000)
        } as Session;
        
        setSession(mockSession);
        
        // Store in localStorage for persistence
        localStorage.setItem('admin-session', JSON.stringify({
          user: mockAdminUser,
          profile: adminProfile,
          session: mockSession,
          expiresAt: expiryTime.getTime()
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
      
      // Generate a unique email using the username
      const email = `${username}@mark-register.internal`;
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, // Store username in user metadata
          },
        },
      });

      if (error) throw error;
      
      // Check if user was created successfully
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

  // Check for stored admin session on init
  useEffect(() => {
    const storedAdminSession = localStorage.getItem('admin-session');
    if (storedAdminSession && !user && !session) {
      try {
        const adminData = JSON.parse(storedAdminSession);
        // Check if session is expired
        if (adminData.expiresAt > Date.now()) {
          setUser(adminData.user);
          setProfile(adminData.profile);
          setSession(adminData.session);
        } else {
          // Clear expired session
          localStorage.removeItem('admin-session');
        }
      } catch (e) {
        localStorage.removeItem('admin-session');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!session || !!profile,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
