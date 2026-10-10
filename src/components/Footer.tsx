import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ClassLevel } from '../types';

interface FooterProps {
  onSelectClass: (classId: ClassLevel) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectClass }) => {
  return (
    <footer className="mt-20 border-t border-[#E8DFC8] bg-[#F5EDE1] text-[#695444]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#D46244] text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-[#2F241C]">
                Exam <span className="text-[#D46244]">WORLD</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A6453] max-w-md leading-relaxed font-medium">
              National Indian school examination and topic test portal at <strong>examworld.site</strong>. Providing tactile grade selection, comprehensive subject coverage, and full-width chapter accordion test series for Classes 6 through 12.
            </p>
          </div>

          {/* Quick Class Links */}
          <div>
            <h4 className="text-xs font-heading font-extrabold text-[#2F241C] uppercase tracking-wider mb-3">
              Middle & Secondary Grades
            </h4>
            <ul className="space-y-1.5 text-xs font-semibold">
              {(['6', '7', '8', '9', '10'] as ClassLevel[]).map((cls) => (
                <li key={cls}>
                  <button
                    onClick={() => {
                      onSelectClass(cls);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#D46244] transition-colors cursor-pointer"
                  >
                    Class {cls} Subjects & Tests
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Senior Secondary Links */}
          <div>
            <h4 className="text-xs font-heading font-extrabold text-[#2F241C] uppercase tracking-wider mb-3">
              Senior Secondary
            </h4>
            <ul className="space-y-1.5 text-xs font-semibold">
              {(['11', '12'] as ClassLevel[]).map((cls) => (
                <li key={cls}>
                  <button
                    onClick={() => {
                      onSelectClass(cls);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#D46244] transition-colors cursor-pointer"
                  >
                    Class {cls} Streams (Sci, Comm, Hum)
                  </button>
                </li>
              ))}
              <li className="pt-2 text-[11px] text-[#937F6F]">
                Standard Mock Tests & Diagnostic Sets
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E3D6C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#8C7A6B]">
          <p>© {new Date().getFullYear()} Exam WORLD · examworld.site. All rights reserved.</p>
          <p>Indian National Curriculum Learning & Testing Platform</p>
        </div>
      </div>
    </footer>
  );
};
