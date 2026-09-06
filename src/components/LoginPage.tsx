import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useGoogleLogin } from '@react-oauth/google';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onSuccessRedirect: () => void;
  redirectReason?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSwitchToSignup,
  onSuccessRedirect,
  redirectReason
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      onSuccessRedirect();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Google Login Trigger Hook
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google Auth Access Token:', tokenResponse.access_token);
      onSuccessRedirect();
    },
    onError: () => {
      setErrorMessage('Google Authentication failed. Please try again.');
    },
  });

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F6F2]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {redirectReason && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#FAF3E8] border border-[#E9D7BF] text-[#7E5723] text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#A86F21] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Authentication Required</span>
              <span>{redirectReason}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-[#1C3627]/5 border border-[#DCE4DA] overflow-hidden">
          <div className="bg-gradient-to-br from-[#14231B] via-[#1E3228] to-[#122019] p-6 sm:p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E7053]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#254233] border border-[#3F6650] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#9AC3AA]" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#A3D0B4]">
                Secure Access
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Sign In to System
            </h1>
            <p className="text-[#B9CBBF] text-xs sm:text-sm mt-1">
              Access the deep learning leaf disease diagnostic pipeline.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div
                id="login-error-alert"
                className="mb-5 p-3.5 rounded-xl bg-[#FBF0EE] border border-[#EAC4BD] text-[#863026] text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#9E362A] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Custom Styled Google Auth Button */}
            <div className="mb-6 flex flex-col items-center">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full py-2.5 px-4 rounded-xl border border-[#CAD8C8] bg-white hover:bg-[#F4F8F4] text-[#1E2E25] font-semibold text-sm shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] border border-[#CBD8CC] cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="w-full relative flex py-4 items-center">
                <div className="flex-grow border-t border-[#DCE4DA]"></div>
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-[#63796D] uppercase tracking-wider">
                  Or email sign in
                </span>
                <div className="flex-grow border-t border-[#DCE4DA]"></div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@pathology.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71897B] hover:text-[#273B30]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2D563F] hover:bg-[#234532] disabled:bg-[#9BB0A3] text-white font-semibold text-sm shadow-md shadow-[#1C3627]/15 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px] border border-[#427357]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E1E8DE] text-center">
              <p className="text-xs sm:text-sm text-[#5D7365]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  id="switch-to-signup-btn"
                  onClick={onSwitchToSignup}
                  className="font-semibold text-[#2D5E43] hover:text-[#1B3F2C] underline underline-offset-2 ml-1"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-[#63796D] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35674B]" />
          <span>Encrypted plant pathology research environment</span>
        </div>
      </motion.div>
    </div>
  );
};