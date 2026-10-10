import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  UserCheck,
  Lock,
  User,
} from 'lucide-react';
import { UserProfile, ClassLevel } from '../types';
import { secureVault } from '../utils/security';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentSuccess: (user: Partial<UserProfile>) => void;
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

  // Student state
  const [studentStep, setStudentStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Admin state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_OTP = '4582';

  useEffect(() => {
    if (studentStep === 'otp' && authMode === 'student') {
      const interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [studentStep, authMode]);

  // Reset errors when switching tab
  const switchTab = (mode: 'student' | 'admin') => {
    setAuthMode(mode);
    setErrorMessage('');
  };

  if (!isOpen) return null;

  // Student OTP Send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStudentStep('otp');
      setOtpValue(DEMO_OTP);
      setResendTimer(30);
    }, 450);
  };

  // Student OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.trim().length !== 4) {
      setErrorMessage('Please enter the 4-digit OTP code');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onStudentSuccess({
        name: studentName.trim() || 'Aarav Sharma',
        mobile: mobileNumber || '9876543210',
        currentClass: defaultClass,
        role: 'student',
      });
    }, 400);
  };

  // Admin Login Handler - encapsulated validation through secure closure
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
    }, 450);
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
            ) : studentStep === 'mobile' ? (
              <Smartphone className="w-7 h-7" />
            ) : (
              <KeyRound className="w-7 h-7" />
            )}
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-[#2F241C] tracking-tight">
            {authMode === 'admin'
              ? 'Administrator Login'
              : studentStep === 'mobile'
              ? 'Student Sign In'
              : 'Verify Mobile Number'}
          </h3>

          <p className="text-xs text-[#7A6656] mt-1 font-medium">
            {targetTestTitle ? (
              <span>Sign in to unlock assessment: <strong>{targetTestTitle}</strong></span>
            ) : authMode === 'admin' ? (
              <span>Enter administrative username & password to access management console</span>
            ) : (
              <span>Access your personalized test series, analytics & scores</span>
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
            <Smartphone className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Student (OTP)</span>
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

        {/* TAB 1: STUDENT OTP AUTHENTICATION */}
        {authMode === 'student' ? (
          studentStep === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-xl bg-white border border-[#DDD0BF] overflow-hidden focus-within:ring-2 focus-within:ring-[#D46244]/40">
                  <span className="px-3 py-3 text-xs font-bold text-[#6D5A4C] bg-[#F2E8DC] border-r border-[#DDD0BF] select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-3 text-[#2F241C] text-sm font-semibold placeholder-[#A8988A] focus:outline-none"
                  />
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
                className="w-full py-3.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] active:bg-[#B3492F] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending OTP...' : 'Get OTP Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-[#8C7A6B] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Simulated Instant OTP Verification · examworld.site</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#F4EDE2] border border-[#E3D6C5] text-center">
                <span className="text-[11px] font-semibold text-[#7A6453]">
                  OTP sent to +91 {mobileNumber || '9876543210'}
                </span>
                <div className="text-xs font-bold text-[#D46244] mt-0.5">
                  (Demo Code: <span className="font-mono font-black">{DEMO_OTP}</span>)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5 text-center">
                  Enter 4-Digit Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="4582"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-center">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256828] active:bg-[#1E5621] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Verifying...' : 'Verify & Launch Assessment'}</span>
              </button>

              <div className="flex items-center justify-between text-xs font-semibold pt-1 text-[#7A6656]">
                <button
                  type="button"
                  onClick={() => setStudentStep('mobile')}
                  className="text-[#594436] hover:underline cursor-pointer"
                >
                  Change Number
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => setResendTimer(30)}
                  className="text-[#D46244] font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                </button>
              </div>
            </form>
          )
        ) : (
          /* TAB 2: ADMIN CREDENTIALS LOGIN */
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#E2E8F0] border border-[#CBD5E1] text-xs text-[#334155]">
              <span className="font-bold block mb-0.5">Admin Credentials:</span>
              <span>Username: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-[#0F172A]">abt1996</code></span>
              <span className="ml-2">Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-[#0F172A]">{currentAdminPassword}</code></span>
            </div>

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
                  placeholder="abt1996"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                />
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
