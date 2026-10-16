import { forwardRef } from 'react';
import type { Profile } from '@/lib/supabase';
import BrandLogo from '@/components/BrandLogo';

export type CertificateType =
  | 'course_completion'
  | 'academic_excellence'
  | 'contest_win'
  | 'points_excellence'
  | 'friend_invite'
  | 'continuous_excellence'
  | 'financial_reward'
  | 'appreciation'
  | 'special_achievement';

export type CertificateData = {
  id: string;
  certificate_type: CertificateType;
  student_name: string;
  title: string;
  description: string;
  grade: string | null;
  subject: string | null;
  issue_date: string;
  metadata: Record<string, unknown>;
};

export type CertificateStyle = {
  label: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  cornerColor: string;
  textColor: string;
  sealColor: string;
  accentColor: string;
};

export const certificateStyles: Record<CertificateType, CertificateStyle> = {
  course_completion: {
    label: 'إتمام مادة',
    icon: '🎓',
    bgGradient: 'from-amber-50 via-yellow-50 to-amber-100',
    borderColor: 'border-amber-500',
    cornerColor: 'border-amber-600',
    textColor: 'text-amber-800',
    sealColor: 'from-amber-400 to-yellow-600',
    accentColor: 'bg-amber-500',
  },
  academic_excellence: {
    label: 'تفوق دراسي',
    icon: '⭐',
    bgGradient: 'from-slate-50 via-gray-50 to-slate-100',
    borderColor: 'border-slate-400',
    cornerColor: 'border-amber-500',
    textColor: 'text-slate-700',
    sealColor: 'from-slate-300 to-slate-500',
    accentColor: 'bg-amber-400',
  },
  contest_win: {
    label: 'فوز بمسابقة',
    icon: '🏆',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-100',
    borderColor: 'border-amber-700',
    cornerColor: 'border-amber-800',
    textColor: 'text-amber-900',
    sealColor: 'from-amber-600 to-orange-800',
    accentColor: 'bg-amber-700',
  },
  points_excellence: {
    label: 'تفوق بالنقاط',
    icon: '💎',
    bgGradient: 'from-purple-50 via-violet-50 to-purple-100',
    borderColor: 'border-purple-400',
    cornerColor: 'border-purple-600',
    textColor: 'text-purple-800',
    sealColor: 'from-purple-400 to-violet-600',
    accentColor: 'bg-purple-500',
  },
  friend_invite: {
    label: 'دعوة أصدقاء',
    icon: '🤝',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-100',
    borderColor: 'border-green-400',
    cornerColor: 'border-green-600',
    textColor: 'text-green-800',
    sealColor: 'from-green-400 to-emerald-600',
    accentColor: 'bg-green-500',
  },
  continuous_excellence: {
    label: 'تفوق مستمر',
    icon: '🔥',
    bgGradient: 'from-sky-50 via-blue-50 to-cyan-100',
    borderColor: 'border-sky-400',
    cornerColor: 'border-sky-600',
    textColor: 'text-sky-800',
    sealColor: 'from-sky-400 to-blue-600',
    accentColor: 'bg-sky-500',
  },
  financial_reward: {
    label: 'جائزة مالية',
    icon: '💰',
    bgGradient: 'from-amber-50 via-orange-50 to-amber-100',
    borderColor: 'border-amber-500',
    cornerColor: 'border-orange-700',
    textColor: 'text-amber-800',
    sealColor: 'from-amber-400 to-orange-600',
    accentColor: 'bg-orange-500',
  },
  appreciation: {
    label: 'شكر وتقدير',
    icon: '🙏',
    bgGradient: 'from-teal-50 via-cyan-50 to-teal-100',
    borderColor: 'border-teal-400',
    cornerColor: 'border-teal-600',
    textColor: 'text-teal-800',
    sealColor: 'from-teal-400 to-cyan-600',
    accentColor: 'bg-teal-500',
  },
  special_achievement: {
    label: 'إنجاز خاص',
    icon: '🎯',
    bgGradient: 'from-rose-50 via-pink-50 to-rose-100',
    borderColor: 'border-rose-400',
    cornerColor: 'border-rose-600',
    textColor: 'text-rose-800',
    sealColor: 'from-rose-400 to-pink-600',
    accentColor: 'bg-rose-500',
  },
};

export const CertificateCard = forwardRef<HTMLDivElement, { certificate: CertificateData }>(
  ({ certificate }, ref) => {
    const style = certificateStyles[certificate.certificate_type];
    const issueDate = new Date(certificate.issue_date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div
        ref={ref}
        dir="rtl"
        className={`relative flex overflow-hidden rounded-2xl bg-gradient-to-br ${style.bgGradient} p-4 font-amiri`}
        style={{ width: 380, height: 270 }}
      >
        {/* Gold decorative border */}
        <div className={`absolute inset-2 rounded-xl border-4 ${style.borderColor}`} />
        <div className="absolute inset-3 rounded-lg border border-blue-700/30" />

        {/* Corner accents */}
        <div className={`absolute right-2 top-2 h-10 w-10 rounded-tr-lg border-r-4 border-t-4 ${style.cornerColor}`} />
        <div className={`absolute left-2 top-2 h-10 w-10 rounded-tl-lg border-l-4 border-t-4 ${style.cornerColor}`} />
        <div className={`absolute right-2 bottom-2 h-10 w-10 rounded-br-lg border-r-4 border-b-4 ${style.cornerColor}`} />
        <div className={`absolute left-2 bottom-2 h-10 w-10 rounded-bl-lg border-l-4 border-b-4 ${style.cornerColor}`} />

        {/* Decorative ornaments */}
        <div className="pointer-events-none absolute right-6 top-6 text-2xl opacity-20">❀</div>
        <div className="pointer-events-none absolute left-6 top-6 text-2xl opacity-20">❀</div>
        <div className="pointer-events-none absolute right-6 bottom-6 text-2xl opacity-20">❀</div>
        <div className="pointer-events-none absolute left-6 bottom-6 text-2xl opacity-20">❀</div>

        <div className="relative flex flex-1 flex-col items-center justify-between py-3 text-center">
          {/* Top: framed logo */}
          <div className="flex flex-col items-center">
            <div className="mb-1 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <BrandLogo imageClassName="h-16 w-24 object-contain" />
            <span className="font-cairo text-[10px] font-bold tracking-widest text-blue-800">ZEIN NOTE</span>
          </div>

          {/* Middle: Title + student name */}
          <div className="flex flex-col items-center">
            <div className="mb-1 text-2xl">{style.icon}</div>
            <h3 className={`font-cairo text-lg font-black ${style.textColor}`}>
              {certificate.title || 'شهادة تقدير'}
            </h3>
            <p className="mt-0.5 text-[10px] text-gray-500">تُمنح إلى</p>
            <h4 className="font-amiri text-xl font-bold text-gray-800">{certificate.student_name}</h4>
            <p className="mt-1 max-w-[280px] text-[10px] leading-snug text-gray-500">
              {certificate.description || style.label}
            </p>
          </div>

          {/* Bottom: Details + seal + signature */}
          <div className="flex w-full items-end justify-between px-4">
            {/* Date */}
            <div className="text-right">
              <p className="text-[8px] text-gray-400">التاريخ</p>
              <p className="font-cairo text-[9px] font-bold text-gray-600">{issueDate}</p>
              {(certificate.grade || certificate.subject) && (
                <p className="mt-0.5 font-cairo text-[9px] text-gray-500">
                  {certificate.subject && `${certificate.subject}`}
                  {certificate.subject && certificate.grade && ' · '}
                  {certificate.grade && `${certificate.grade}`}
                </p>
              )}
            </div>

            {/* Gold seal */}
            <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${style.sealColor} shadow-lg`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/60 text-xl">
                {style.icon}
              </div>
            </div>

            {/* Signature */}
            <div className="text-left">
              <p className="text-[8px] text-gray-400">التوقيع</p>
              <div className="font-amiri text-sm italic text-gray-400">Zein Note</div>
              <div className={`mt-0.5 h-px w-16 ${style.accentColor}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateCard.displayName = 'CertificateCard';
