import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase/config';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
      const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });


      if (error) {
        console.error('Sign up error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user data returned from server');
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { 
        user: null, 
        error: {
          message: error.message || 'Failed to sign up',
          status: error.status,
          code: error.code
        }
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });


      if (error) {
        console.error('Sign in error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user data returned from server');
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { 
        user: null, 
        error: {
          message: error.message || 'Failed to sign in',
          status: error.status,
          code: error.code
        }
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
