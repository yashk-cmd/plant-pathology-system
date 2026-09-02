import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

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

  const handleFillDemo = () => {
    setEmail('demo@pathology.org');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F6F2]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Redirect Notice if unauthenticated attempt occurred */}
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
          {/* Card Header with Botanical Branding */}
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

          {/* Form Body */}
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

            {/* 1-Click Demo Fill Button */}
            <div className="mb-6 p-3 rounded-xl bg-[#EEF5EF] border border-[#CDE1D0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D5A42]" />
                <span className="text-xs font-medium text-[#1E4A33]">
                  Quick evaluation credentials
                </span>
              </div>
              <button
                type="button"
                id="quick-demo-fill-btn"
                onClick={handleFillDemo}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2D563F] hover:bg-[#234532] text-white shadow-sm transition-all border border-[#427357]"
              >
                Autofill Demo
              </button>
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

            {/* Switch to Signup */}
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
