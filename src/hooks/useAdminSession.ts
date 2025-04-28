
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types/auth";

export const createAdminSession = () => {
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
  } as User;
  
  // Create a mock admin profile
  const adminProfile: Profile = {
    id: mockAdminId,
    username: 'admin',
    role: 'admin'
  };
  
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

  return {
    user: mockAdminUser,
    profile: adminProfile,
    session: mockSession,
    expiryTime: expiryTime.getTime()
  };
};
