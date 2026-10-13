import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { UserProfile, ClassLevel } from '../types';
import { secureVault } from '../utils/security';
import { loginStudent } from '../services/authApi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentSuccess: (user: Partial<UserProfile> & { token?: string }) => void;
  onAdminSuccess: () => void;
  targetTestTitle?: string;
  defaultClass?: ClassLevel;
  currentAdminPassword?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onStudentSuccess,
  onAdminSuccess,
  targetTestTitle,
  defaultClass = '10',
  currentAdminPassword = '12345',
}) => {
  const [authMode, setAuthMode] = useState<'student' | 'admin'>('student');

  // Student Credentials State
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Admin Credentials State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Reset notices when switching modes
  const switchTab = (mode: 'student' | 'admin') => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessNotice('');
  };

  // Student Login Submission
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentUsername.trim() || !studentPassword.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setErrorMessage('');
    setSuccessNotice('');
    setIsLoading(true);

    try {
      const result = await loginStudent(studentUsername, studentPassword);
      setSuccessNotice(`Welcome back, ${result.user.name}!`);

      setTimeout(() => {
        setIsLoading(false);
        onStudentSuccess({
          id: result.user.id,
          name: result.user.name,
          username: result.user.username,
          currentClass: (result.user.currentClass as ClassLevel) || defaultClass,
          role: 'student',
          token: result.token,
        });
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        err.message || 'Invalid username or password. Please verify your credentials.'
      );
    }
  };

  // Admin Login Submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isAuthorized = secureVault.verifyAdminCredentials(adminUsername, adminPassword);

      if (isAuthorized) {
        onAdminSuccess();
      } else {
        setErrorMessage('Invalid administrator credentials. Please check your username and password.');
      }
    }, 350);
  };

  // Quick fill helper for demo accounts
  const handleFillDemo = (username: string, pass: string) => {
    setStudentUsername(username);
    setStudentPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#D46244] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            {authMode === 'admin' ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <GraduationCap className="w-7 h-7" />
            )}
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-[#2F241C] tracking-tight">
            {authMode === 'admin' ? 'Administrator Login' : 'Student Portal Sign In'}
          </h3>

          <p className="text-xs text-[#7A6656] mt-1 font-medium">
            {targetTestTitle ? (
              <span>Sign in to unlock test: <strong>{targetTestTitle}</strong></span>
            ) : authMode === 'admin' ? (
              <span>Enter administrative username & master password</span>
            ) : (
              <span>Enter your registered student username and password</span>
            )}
          </p>
        </div>

        {/* Unified Mode Switcher Tabs */}
        <div className="flex p-1 bg-[#EFE5D8] rounded-xl border border-[#DFD3C2] mb-5">
          <button
            type="button"
            onClick={() => switchTab('student')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'student'
                ? 'bg-white text-[#2F241C] shadow-xs'
                : 'text-[#6D5A4C] hover:text-[#2F241C]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'admin'
                ? 'bg-[#1E293B] text-white shadow-xs'
                : 'text-[#6D5A4C] hover:text-[#2F241C]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* TAB 1: STUDENT USERNAME / PASSWORD LOGIN */}
        {authMode === 'student' ? (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  placeholder="e.g. student1 or priya_patel"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#8C7A6B] font-medium">Case sensitive</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type={showStudentPassword ? 'text' : 'password'}
                  required
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowStudentPassword(!showStudentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#564335] cursor-pointer"
                  tabIndex={-1}
                >
                  {showStudentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMessage}
              </p>
            )}

            {/* Success Message */}
            {successNotice && (
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] active:bg-[#B3492F] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo Student Credentials Helper */}
            <div className="pt-2 border-t border-[#E8DFC8]">
              <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block mb-1.5 text-center">
                Quick Demo Accounts (Pre-configured)
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={() => handleFillDemo('student1', 'password123')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFE5D8] hover:bg-[#E4D8C8] text-[#564335] text-[11px] font-semibold border border-[#DDD0BF] cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#D46244]" />
                  <span>@student1 / password123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('priya_patel', 'student123')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFE5D8] hover:bg-[#E4D8C8] text-[#564335] text-[11px] font-semibold border border-[#DDD0BF] cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#D46244]" />
                  <span>@priya_patel / student123</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* TAB 2: ADMIN CREDENTIALS LOGIN */
          <form onSubmit={handleAdminLogin} className="space-y-4">
            

            <div>
              <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#564335] cursor-pointer"
                  tabIndex={-1}
                >
                  {showAdminPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>{isLoading ? 'Verifying Admin...' : 'Log in as Administrator'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
