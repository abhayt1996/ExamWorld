import React, { useState, useEffect } from 'react';
import { X, Smartphone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProfile, ClassLevel } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: Partial<UserProfile>) => void;
  targetTestTitle?: string;
  defaultClass?: ClassLevel;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetTestTitle,
  defaultClass = '10',
}) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_OTP = '4582';

  useEffect(() => {
    if (step === 'otp') {
      const interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

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
      setStep('otp');
      setOtpValue(DEMO_OTP); // Pre-fill demo OTP for fast test driving!
      setResendTimer(30);
    }, 600);
  };

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
      onSuccess({
        name: studentName.trim() || 'Aarav Sharma',
        mobile: mobileNumber || '9876543210',
        currentClass: defaultClass,
      });
    }, 500);
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
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#D46244] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            {step === 'mobile' ? (
              <Smartphone className="w-7 h-7" />
            ) : (
              <KeyRound className="w-7 h-7" />
            )}
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-[#2F241C] tracking-tight">
            {step === 'mobile' ? 'Student Sign In' : 'Verify Mobile Number'}
          </h3>

          <p className="text-xs text-[#7A6656] mt-1 font-medium">
            {targetTestTitle ? (
              <span>Sign in with OTP to start <strong>{targetTestTitle}</strong></span>
            ) : (
              <span>Access your personalized test series, analytics & scores</span>
            )}
          </p>
        </div>

        {/* Step 1: Mobile Input Form */}
        {step === 'mobile' ? (
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
              <span>{isLoading ? 'Generating OTP...' : 'Get OTP Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#8C7A6B] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Simulated Instant OTP Verification · examworld.site</span>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification Form */
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
                onClick={() => setStep('mobile')}
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
                <span>{resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
