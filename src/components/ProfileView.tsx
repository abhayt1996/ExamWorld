import React, { useState } from 'react';
import {
  User,
  Phone,
  GraduationCap,
  Mail,
  Edit3,
  Check,
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
  Award,
  KeyRound,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, ClassLevel } from '../types';
import { CLASSES_LIST } from '../data/curriculumData';
import { secureVault } from '../utils/security';

interface ProfileViewProps {
  user: UserProfile;
  currentAdminPassword?: string;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAdminChangePassword?: (newPass: string) => void;
  onBackToHome: () => void;
  onOpenDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentAdminPassword = '12345',
  onUpdateProfile,
  onAdminChangePassword,
  onBackToHome,
  onOpenDashboard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile);
  const [currentClass, setCurrentClass] = useState<ClassLevel>(user.currentClass);
  const [email, setEmail] = useState(user.email);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  // Admin Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const isAdmin = user.role === 'admin';

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      mobile: mobile.trim(),
      currentClass,
      email: email.trim(),
    });
    setIsEditing(false);
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!secureVault.verifyCurrentPass(oldPassword) && oldPassword !== currentAdminPassword) {
      setPasswordError('Current password does not match.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const updated = secureVault.updateAdminPass(oldPassword, newPassword);
    if (onAdminChangePassword) {
      onAdminChangePassword(newPassword);
    }
    setPasswordSuccess('Admin password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Classes</span>
        </button>

        <button
          onClick={onOpenDashboard}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs cursor-pointer ${
            isAdmin ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-[#D46244] hover:bg-[#C25538]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{isAdmin ? 'Open Admin Control Panel' : 'Go to Analytics Dashboard'}</span>
        </button>
      </div>

      {showSavedAlert && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-md overflow-hidden">
        {/* Banner with Profile Avatar */}
        <div
          className={`p-8 border-b border-[#E1D4C3] flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 ${
            isAdmin
              ? 'bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white'
              : 'bg-gradient-to-r from-[#F2E8DC] via-[#EFE3D5] to-[#E8DDD0]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div
              className={`w-24 h-24 rounded-full text-white font-heading font-black text-4xl flex items-center justify-center shadow-md ring-4 ring-white ${
                isAdmin
                  ? 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7]'
                  : 'bg-gradient-to-br from-[#D46244] to-[#B3492F]'
              }`}
            >
              {isAdmin ? 'A' : initialLetter}
            </div>

            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 border ${
                  isAdmin
                    ? 'bg-white/10 text-emerald-400 border-white/20'
                    : 'bg-[#E5D7C6] text-[#5C4535] border-[#D5C3AF]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAdmin ? 'Super Administrator Access' : 'Verified Student Account'}</span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-heading font-extrabold ${
                  isAdmin ? 'text-white' : 'text-[#2F241C]'
                }`}
              >
                {isAdmin ? 'Administrator (abt1996)' : user.name}
              </h1>
              <p
                className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                  isAdmin ? 'text-slate-300' : 'text-[#7D6B5C]'
                }`}
              >
                {isAdmin
                  ? 'Full Portal Control · Grade Management · Live Analytics'
                  : `Class ${user.currentClass} · ${user.mobile ? `+91 ${user.mobile}` : 'No phone linked'}`}
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-xs font-bold text-[#564436] hover:bg-[#FAF4ED] active:bg-[#F2E9DE] transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-[#D46244]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-xs font-bold text-[#564436] hover:bg-[#FAF4ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-10">
          {isAdmin ? (
            /* ADMIN SPECIFIC PROFILE VIEW (WITH CHANGE PASSWORD FEATURE) */
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E3D7C7]">
                  <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block">
                    Username
                  </span>
                  <span className="text-base font-bold text-[#2F241C] font-mono mt-0.5 block">
                    abt1996
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E3D7C7]">
                  <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block">
                    Access Level
                  </span>
                  <span className="text-base font-bold text-[#2E7D32] mt-0.5 block">
                    Full Administrative Privileges
                  </span>
                </div>
              </div>

              {/* CHANGE PASSWORD COMPONENT */}
              <div className="p-6 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#D46244]" />
                    <h3 className="font-heading font-bold text-base text-[#2F241C]">
                      Change Administrator Password
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#8C7A6B] font-mono">
                    Default: {currentAdminPassword}
                  </span>
                </div>

                {passwordError && (
                  <p className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {passwordError}
                  </p>
                )}

                {passwordSuccess && (
                  <p className="mb-4 text-xs font-semibold text-[#1B5E20] bg-[#E8F5E9] p-2.5 rounded-xl border border-[#A5D6A7] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{passwordSuccess}</span>
                  </p>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-sm text-[#2F241C] focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 4 chars)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-sm text-[#2F241C] focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-sm text-[#2F241C] focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Save New Password</span>
                  </button>
                </form>
              </div>
            </div>
          ) : !isEditing ? (
            /* STUDENT VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-[#E4D8C8] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5EDE1] flex items-center justify-center text-[#D46244] shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8C7A6B] block">
                    Student Full Name
                  </span>
                  <span className="text-base font-bold text-[#2F241C] mt-0.5 block">
                    {user.name}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4D8C8] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5EDE1] flex items-center justify-center text-[#D46244] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8C7A6B] block">
                    Registered Mobile Number
                  </span>
                  <span className="text-base font-bold text-[#2F241C] mt-0.5 block">
                    +91 {user.mobile}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4D8C8] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5EDE1] flex items-center justify-center text-[#D46244] shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8C7A6B] block">
                    Academic Grade / Standard
                  </span>
                  <span className="text-base font-bold text-[#2F241C] mt-0.5 block">
                    Class {user.currentClass}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4D8C8] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5EDE1] flex items-center justify-center text-[#D46244] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8C7A6B] block">
                    Notification Email
                  </span>
                  <span className="text-base font-bold text-[#2F241C] mt-0.5 block truncate">
                    {user.email || 'aarav.sharma@examworld.site'}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 p-5 rounded-2xl bg-[#F4EDE2] border border-[#E1D4C3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#D46244]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#423126]">
                      Assessment History & Badges
                    </h4>
                    <p className="text-[11px] text-[#7A6656] font-medium">
                      You have attempted {user.testHistory.length} topic tests across subjects.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenDashboard}
                  className="px-4 py-2 rounded-xl bg-[#4A3728] text-white text-xs font-bold hover:bg-[#3D2C1E] transition-colors cursor-pointer"
                >
                  View Full Report
                </button>
              </div>
            </div>
          ) : (
            /* STUDENT EDIT MODE */
            <form onSubmit={handleSaveStudent} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-2">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-2">
                  Mobile Number (10 digits)
                </label>
                <div className="flex items-center rounded-xl bg-white border border-[#DDD0BF] overflow-hidden focus-within:ring-2 focus-within:ring-[#D46244]/40">
                  <span className="px-3.5 py-3 text-xs font-bold text-[#6D5A4C] bg-[#F2E8DC] border-r border-[#DDD0BF]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-3 text-[#2F241C] text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-2">
                  Current Grade / Class
                </label>
                <select
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value as ClassLevel)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 cursor-pointer"
                >
                  {CLASSES_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564335] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 rounded-xl bg-white border border-[#DDD0BF] text-[#564436] text-xs font-bold hover:bg-[#FAF4ED] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
