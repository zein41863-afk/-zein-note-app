import { useEffect, useState } from 'react';
import { Star, Award, LogOut, Calendar, GraduationCap, BookUser, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ZodiacCard from '@/components/ZodiacCard';
import { getTotalPoints, getLevelInfo } from '@/lib/points';
import BrandLogo from '@/components/BrandLogo';

type AccountPageProps = {
  onBack: () => void;
};

function AccountPage({ onBack }: AccountPageProps) {
  const { profile, user, signOut } = useAuth();
  const [livePoints, setLivePoints] = useState<number>(profile?.points ?? 0);

  useEffect(() => {
    if (!user) return;
    getTotalPoints(user.id).then((pts) => setLivePoints(pts));
  }, [user]);

  if (!profile) return null;

  const liveLevel = getLevelInfo(livePoints);

  const accountTypeLabel = profile.account_type === 'student' ? 'طالب' : 'ولي أمر';
  const accountTypeIcon = profile.account_type === 'student' ? GraduationCap : BookUser;

  const AccountIcon = accountTypeIcon;

  return (
    <div className="min-h-screen bg-zen-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-tajawal text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </button>

        {/* Profile card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="flex justify-center border-b border-white/10 px-6 py-5">
            <BrandLogo imageClassName="h-20 w-20 rounded-2xl shadow-xl shadow-zen-blue/20" showName nameClassName="text-2xl text-white" />
          </div>
          {/* Header banner */}
          <div className="relative h-24 bg-gradient-to-br from-zen-blue via-blue-600 to-blue-800">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,167,38,0.15),transparent_60%)]" />
          </div>

          {/* Name + avatar (vertical, centered) */}
          <div className="flex flex-col items-center px-6 pb-6">
            {/* Name */}
            <h1 className="mt-5 text-center font-cairo text-2xl font-black text-white sm:text-3xl break-words">
              {profile.full_name}
            </h1>
            <p className="mt-1 max-w-full break-all text-center font-tajawal text-sm text-white/50" dir="ltr">
              {user?.email}
            </p>

            {/* Avatar */}
            <div className="mt-5 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-zen-bg bg-gradient-to-br from-zen-gold to-amber-600 text-4xl font-black text-white shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                profile.full_name.charAt(0) || 'Z'
              )}
            </div>

            {/* Stats: points + level (live from database) */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zen-gold/20 bg-zen-gold/10 p-4 text-center">
                <Star className="mx-auto mb-2 h-6 w-6 text-zen-gold" />
                <div className="font-cairo text-3xl font-black text-zen-gold">{livePoints}</div>
                <div className="mt-1 font-tajawal text-xs text-white/60">النقاط</div>
              </div>
              <div className="rounded-2xl border border-zen-blue/20 bg-zen-blue/10 p-4 text-center">
                <Award className="mx-auto mb-2 h-6 w-6 text-zen-blue" />
                <div className="font-cairo text-3xl font-black text-zen-blue">{liveLevel.level}</div>
                <div className="mt-1 font-tajawal text-xs text-white/60">{liveLevel.name}</div>
              </div>
            </div>

            {/* Info rows */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <Calendar className="h-5 w-5 text-white/40" />
                <span className="font-tajawal text-sm text-white/60">تاريخ الميلاد</span>
                <span className="mr-auto font-tajawal text-sm font-medium text-white">
                  {profile.birth_date || 'غير محدد'}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <GraduationCap className="h-5 w-5 text-white/40" />
                <span className="font-tajawal text-sm text-white/60">الصف الدراسي</span>
                <span className="mr-auto font-tajawal text-sm font-medium text-white">
                  {profile.grade}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <AccountIcon className="h-5 w-5 text-white/40" />
                <span className="font-tajawal text-sm text-white/60">نوع الحساب</span>
                <span className="mr-auto font-tajawal text-sm font-medium text-white">
                  {accountTypeLabel}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <Mail className="h-5 w-5 text-white/40" />
                <span className="font-tajawal text-sm text-white/60">البريد الإلكتروني</span>
                <span className="mr-auto max-w-[60%] truncate font-tajawal text-sm font-medium text-white" dir="ltr">
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Zodiac Card */}
            <div className="mt-6">
              <ZodiacCard fullName={profile.full_name} birthDate={profile.birth_date} />
            </div>

            {/* Sign out */}
            <button
              onClick={signOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3.5 font-cairo text-base font-bold text-red-400 transition-all duration-300 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
