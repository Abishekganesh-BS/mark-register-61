
import { createContext, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { useAuthOperations } from "@/hooks/useAuthOperations";

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
  const {
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
  } = useAuthOperations();

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
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Check for stored admin session on init
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

    return () => {
      subscription.unsubscribe();
    };
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
