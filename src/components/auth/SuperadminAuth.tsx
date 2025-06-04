import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

const SuperadminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Check if user has super_admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profileError || !profile || profile.role !== 'super_admin') {
          setError('Access denied. Super admin privileges required.');
          await supabase.auth.signOut();
          return;
        }

        // Successful login - the route will re-render and show dashboard
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="container mx-auto px-4 py-8 relative">
        <Link to="/">
          <img 
            src="/leafiq-logo.png" 
            alt="LeafIQ" 
            className="h-16 drop-shadow-lg filter shadow-primary-500/50"
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full relative border border-white/20">
            <div className="absolute top-4 left-4">
              <Link 
                to="/" 
                className="flex items-center text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
            
            <div className="text-center mb-8 mt-8">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-display font-semibold mb-2 text-white">
                Superadmin Access
              </h2>
              <p className="text-white/70">
                Platform administration and oversight
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Only authorized superadmin accounts can access this area
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const SuperadminAuth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 SuperadminAuth: Starting simple auth check...');
    
    // Just check current user immediately
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          setIsLoading(false);
          return;
        }

        if (user) {
          console.log('✅ User found:', user.email);
          setUser(user);
          
          // Quick superadmin check
          if (user.email === 'jakerains@gmail.com') {
            console.log('✅ Superadmin detected by email');
            setIsSuperAdmin(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        setIsSuperAdmin(session.user.email === 'jakerains@gmail.com');
      } else {
        setUser(null);
        setIsSuperAdmin(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return (
      <Routes>
        <Route path="*" element={<SuperadminLogin />} />
      </Routes>
    );
  }

  // Dynamically import SuperadminDashboard to avoid circular import
  const SuperadminDashboard = React.lazy(() => import('../../views/superadmin/SuperadminDashboard'));
  
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <Routes>
        <Route path="/*" element={<SuperadminDashboard />} />
      </Routes>
    </React.Suspense>
  );
};

export default SuperadminAuth; 