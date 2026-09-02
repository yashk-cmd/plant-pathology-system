import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onSuccessRedirect: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSwitchToLogin,
  onSuccessRedirect
}) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live validation checks
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passLengthValid = password.length >= 8;
  const passMatchValid = password.length > 0 && password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailValid) {
      setErrorMessage('Please provide a valid email format (e.g. name@domain.com).');
      return;
    }

    if (!passLengthValid) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!passMatchValid) {
      setErrorMessage('Passwords do not match. Please re-verify.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(email, password, name);
      onSuccessRedirect();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F6F2]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-[#1C3627]/5 border border-[#DCE4DA] overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-br from-[#14231B] via-[#1E3228] to-[#122019] p-6 sm:p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E7053]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#254233] border border-[#3F6650] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#9AC3AA]" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#A3D0B4]">
                New Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-[#B9CBBF] text-xs sm:text-sm mt-1">
              Join the plant pathology network for instant leaf diagnosis.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div
                id="signup-error-alert"
                className="mb-5 p-3.5 rounded-xl bg-[#FBF0EE] border border-[#EAC4BD] text-[#863026] text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#9E362A] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Full Name / Lab Title <span className="text-[#7E9487] font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agronomist@farm.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Password (min 8 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71897B] hover:text-[#273B30]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#273B30] uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#71897B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-confirm-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CAD8C8] bg-[#FBFDFB] text-[#1E2E25] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#35674B]/20 focus:border-[#35674B] transition-all"
                  />
                </div>
              </div>

              {/* Validation Checklist Pills */}
              <div className="py-1.5 space-y-1 text-xs">
                <div className={`flex items-center gap-1.5 ${passLengthValid ? 'text-[#245038]' : 'text-[#819588]'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passLengthValid ? 'text-[#35674B]' : 'text-[#A4B5AB]'}`} />
                  <span>Password has 8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passMatchValid ? 'text-[#245038]' : 'text-[#819588]'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passMatchValid ? 'text-[#35674B]' : 'text-[#A4B5AB]'}`} />
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[#2D563F] hover:bg-[#234532] disabled:bg-[#9BB0A3] text-white font-semibold text-sm shadow-md shadow-[#1C3627]/15 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px] border border-[#427357]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 pt-5 border-t border-[#E1E8DE] text-center">
              <p className="text-xs sm:text-sm text-[#5D7365]">
                Already registered?{' '}
                <button
                  type="button"
                  id="switch-to-login-btn"
                  onClick={onSwitchToLogin}
                  className="font-semibold text-[#2D5E43] hover:text-[#1B3F2C] underline underline-offset-2 ml-1"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-[#63796D] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35674B]" />
          <span>Agricultural research data protected</span>
        </div>
      </motion.div>
    </div>
  );
};
