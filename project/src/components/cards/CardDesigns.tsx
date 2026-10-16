import { forwardRef } from 'react';
import {
  BookOpen,
  BookOpenCheck,
  Camera,
  Contact,
  GraduationCap,
  Layers3,
  Lightbulb,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';
import type { Profile } from '@/lib/supabase';
import { getZodiacSign } from '@/lib/zodiac';
import BrandLogo from '@/components/BrandLogo';

type CardProps = { profile: Profile; userId: string };

function getAgeYears(birthDate: string | null): number {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
    years--;
  }
  return years;
}

function getShortId(userId: string): string {
  return userId.substring(0, 8).toUpperCase();
}

function StudentQrCode() {
  const cells = Array.from({ length: 121 }, (_, index) => {
    const row = Math.floor(index / 11);
    const column = index % 11;
    const inFinder = (startRow: number, startColumn: number) =>
      row >= startRow && row < startRow + 5 && column >= startColumn && column < startColumn + 5;
    const finderCell = (startRow: number, startColumn: number) => {
      const localRow = row - startRow;
      const localColumn = column - startColumn;
      return localRow === 0 || localRow === 4 || localColumn === 0 || localColumn === 4 || (localRow === 2 && localColumn === 2);
    };
    const finder = inFinder(0, 0) || inFinder(0, 6) || inFinder(6, 0);
    return finder ? finderCell(row < 5 ? 0 : row < 6 ? 0 : 6, column < 5 ? 0 : column > 5 ? 6 : 0) : (row * 7 + column * 11) % 5 < 2;
  });

  return (
    <div className="grid grid-cols-11 gap-[2px] rounded-md bg-white p-2 shadow-inner" aria-label="رمز QR تجريبي">
      {cells.map((filled, index) => <span key={index} className={`aspect-square ${filled ? 'bg-slate-950' : 'bg-white'}`} />)}
    </div>
  );
}

function StudentInfoField({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div dir="rtl" className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0755B5] text-white shadow-sm sm:h-11 sm:w-11">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-bold text-[#07377A] sm:text-xs">{label}</p>
        <div className="min-h-7 truncate rounded-lg border-2 border-[#83BBF5] bg-white/70 px-2 py-1 text-xs font-bold text-[#0B3F86] sm:min-h-9 sm:px-3 sm:text-sm">{value}</div>
      </div>
    </div>
  );
}

/* Card 1: Student ID Card */
export const StudentIdCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile, userId }, ref) => {
    const studentNumber = `ZN-2025-${getShortId(userId).slice(0, 4) || '0000'}`;

    return (
      <div
        ref={ref}
        dir="rtl"
        className="relative aspect-[1.55] w-full max-w-[1000px] overflow-hidden rounded-[24px] border-[3px] border-[#FFB91E] bg-[#F8FBFF] p-3 font-cairo text-[#07377A] shadow-2xl sm:rounded-[38px] sm:p-6"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 26%, rgba(53, 139, 225, 0.08), transparent 26%), radial-gradient(circle at 80% 70%, rgba(255, 185, 30, 0.08), transparent 24%)' }}
      >
        <div className="pointer-events-none absolute -left-[10%] -top-[28%] h-[52%] w-[62%] -rotate-[13deg] rounded-[50%] border-[14px] border-[#FFBA25] sm:border-[24px]" />
        <div className="pointer-events-none absolute -left-[13%] -top-[27%] h-[49%] w-[60%] -rotate-[13deg] rounded-[50%] border-[3px] border-[#0755B5] sm:border-[5px]" />
        <div className="pointer-events-none absolute -bottom-[35%] -right-[12%] h-[62%] w-[70%] rotate-[16deg] rounded-[50%] border-[12px] border-[#FFB91E] sm:border-[22px]" />
        <div className="pointer-events-none absolute -bottom-[36%] -right-[13%] h-[59%] w-[68%] rotate-[16deg] rounded-[50%] border-[3px] border-[#0755B5] sm:border-[5px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <BookOpen className="absolute left-[43%] top-[5%] h-10 w-10 rotate-[-16deg] text-[#4EA0F0] sm:h-16 sm:w-16" />
          <Lightbulb className="absolute left-[56%] top-[6%] h-9 w-9 text-[#4EA0F0] sm:h-14 sm:w-14" />
          <Star className="absolute left-[73%] top-[10%] h-8 w-8 text-[#4EA0F0] sm:h-12 sm:w-12" />
          <Star className="absolute left-[34%] bottom-[20%] h-8 w-8 text-[#4EA0F0] sm:h-12 sm:w-12" />
        </div>

        <div dir="ltr" className="relative grid h-full grid-cols-[34%_43%_23%] gap-2 sm:gap-5">
          <div className="flex min-w-0 flex-col items-center pt-[2%] text-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="Zein Note" className="h-12 w-12 object-contain sm:h-24 sm:w-24" crossOrigin="anonymous" />
              <div dir="ltr" className="text-left">
                <h2 className="text-lg font-black tracking-tight text-[#07377A] sm:text-4xl">Zein <span className="text-[#0873E6]">Note</span></h2>
                <p className="mt-0.5 text-[7px] font-bold text-[#07377A] sm:text-sm">منصة التعلم الذكية</p>
                <p className="text-[6px] font-bold text-[#07377A] sm:text-xs">تعلم .. طموح .. مستقبل أفضل</p>
              </div>
            </div>

            <div className="relative mt-[12%] flex w-[98%] items-center justify-center bg-[#0755B5] px-3 py-2 text-lg font-black text-white shadow-lg [clip-path:polygon(4%_0,96%_0,100%_50%,96%_100%,4%_100%,0_50%)] sm:mt-[15%] sm:px-6 sm:py-4 sm:text-4xl">
              <span>كارت طالب</span>
              <span className="absolute left-3 text-[#FFB91E] sm:left-7">‹</span>
              <span className="absolute right-3 text-[#FFB91E] sm:right-7">›</span>
            </div>
            <p className="mt-3 text-[11px] font-bold text-[#07377A] sm:mt-5 sm:text-xl">أنت قادر على تحقيق حلمك</p>
            <div className="mt-1 h-1 w-1/2 -rotate-2 rounded-full bg-[#FFB91E] sm:mt-2 sm:h-1.5" />

            <div className="mt-auto flex w-full items-end gap-3 pb-[3%] sm:gap-6">
              <div className="w-[37%] text-center">
                <div className="mx-auto w-full max-w-[105px] rounded-lg border-2 border-[#0755B5] bg-white p-1.5 sm:p-2"><StudentQrCode /></div>
                <p className="mt-2 text-[7px] font-bold leading-tight sm:text-xs">امسح الكود للوصول لحسابك على المنصة</p>
              </div>
              <div className="h-24 w-px bg-[#75B5F2] sm:h-32" />
              <div className="flex-1 rounded-xl bg-[#DCEEFF] px-2 py-2 text-center sm:rounded-2xl sm:px-4 sm:py-4">
                <ShieldCheck className="mx-auto h-5 w-5 text-[#0755B5] sm:h-7 sm:w-7" />
                <p className="text-[8px] font-bold sm:text-xs">رقم الطالب</p>
                <p dir="ltr" className="mt-1 text-[10px] font-black text-[#07377A] sm:text-lg">{studentNumber}</p>
              </div>
            </div>
          </div>

          <div dir="rtl" className="flex min-w-0 flex-col justify-center gap-2 pt-[8%] sm:gap-3">
            <StudentInfoField icon={UserRound} label="اسم الطالب / الطالبة" value={profile.full_name} />
            <StudentInfoField icon={GraduationCap} label="الصف الدراسي" value={profile.grade || 'الأول الإعدادي'} />
            <StudentInfoField icon={Layers3} label="المرحلة الدراسية" value="المرحلة الإعدادية" />
            <StudentInfoField icon={BookOpenCheck} label="المادة المفضلة" value="—" />
            <StudentInfoField icon={Contact} label="رقم الطالب" value={studentNumber} />
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center pt-[8%]">
            <div className="relative flex aspect-[0.82] w-full max-w-[190px] items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[#0755B5] bg-[#ECF5FF] p-2 sm:rounded-[22px] sm:border-4 sm:p-3">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#D9E0EB] text-[#AAB5C6]">
                {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" crossOrigin="anonymous" /> : <UserRound className="h-1/2 w-1/2" strokeWidth={1.25} />}
                <Camera className="absolute bottom-[31%] h-5 w-5 text-white sm:h-8 sm:w-8" />
              </div>
            </div>
            <p className="mt-2 text-center text-[9px] font-bold text-[#07377A] sm:text-sm">صورة الطالب</p>
            <p className="text-[8px] text-[#5E86B3] sm:text-xs">(اختياري)</p>
          </div>
        </div>

        <div className="absolute bottom-[3%] right-[61%] hidden items-end gap-2 text-center sm:flex">
          <div className="w-28 border-b-2 border-[#79A9D7] pb-1 text-[10px] font-bold">إدارة منصة زين نوت</div>
          <BookOpenCheck className="h-10 w-10 text-[#0755B5]" />
        </div>
      </div>
    );
  }
);
StudentIdCard.displayName = 'StudentIdCard';

/* Card 2: Certificate (horizontal) */
export const CertificateCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => (
    <div
      ref={ref}
      dir="rtl"
      className="relative flex h-52 w-80 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 font-cairo"
      style={{ width: 320, height: 220 }}
    >
      {/* Gold decorative border */}
      <div className="absolute inset-2 rounded-xl border-4 border-amber-500/60" />
      <div className="absolute inset-3 rounded-lg border border-blue-700/40" />

      {/* Corner accents */}
      <div className="absolute right-2 top-2 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-blue-700" />
      <div className="absolute left-2 top-2 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-blue-700" />
      <div className="absolute right-2 bottom-2 h-8 w-8 rounded-br-lg border-r-4 border-b-4 border-blue-700" />
      <div className="absolute left-2 bottom-2 h-8 w-8 rounded-bl-lg border-l-4 border-b-4 border-blue-700" />

      <div className="relative flex flex-col items-center text-center">
        {/* Logo with gold frame */}
        <div className="mb-1 flex flex-col items-center">
          <div className="mb-1 h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <BrandLogo imageClassName="h-12 w-24 object-contain" />
          <span className="text-[10px] font-bold tracking-widest text-blue-800">ZEIN NOTE</span>
        </div>

        <h3 className="text-xl font-black text-amber-700">شهادة تقدير</h3>
        <p className="mt-1 text-[10px] text-gray-500">تُمنح إلى</p>
        <h4 className="text-base font-black text-blue-900">{profile.full_name}</h4>
        <p className="mt-1 text-[10px] text-gray-500">تقديراً لجهوده المتميزة</p>
        <div className="mt-2 flex items-center gap-4 text-[9px] text-gray-400">
          <span>{profile.grade}</span>
          <span>{new Date().toLocaleDateString('ar-EG')}</span>
        </div>
      </div>
    </div>
  )
);
CertificateCard.displayName = 'CertificateCard';

/* Card 3: Achievement Card (horizontal) */
export const AchievementCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => (
    <div
      ref={ref}
      dir="rtl"
      className="relative flex h-48 w-80 flex-col items-center justify-center overflow-hidden rounded-2xl bg-black p-5 font-cairo"
      style={{ width: 320, height: 200 }}
    >
      {/* Stars background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <BrandLogo imageClassName="absolute bottom-4 right-4 h-11 w-11 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/30" />
      <div className="relative flex flex-col items-center text-center">
        {/* Trophy icon */}
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/50">
          <span className="text-3xl">🏆</span>
        </div>
        <h3 className="text-lg font-black text-amber-400">إنجاز جديد</h3>
        <p className="mt-1 text-xs text-white/70">وصلت إلى المستوى {profile.level}</p>

        {/* Points earned */}
        <div className="mt-2 flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1 text-sm font-bold text-amber-400">
          {profile.points} نقطة
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-500"
            style={{ width: `${Math.min(100, (profile.points % 100))}%` }}
          />
        </div>
      </div>
    </div>
  )
);
AchievementCard.displayName = 'AchievementCard';

/* Card 4: Gamer Card (vertical) */
export const GamerCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => {
    const badges = ['🎮', '⭐', '🔥', '💎'];
    return (
      <div
        ref={ref}
        dir="rtl"
        className="relative flex h-96 w-64 flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-950 p-5 font-cairo"
        style={{ width: 256, height: 384 }}
      >
        {/* Glow effects */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />

        {/* Header */}
        <BrandLogo imageClassName="absolute right-5 top-5 h-10 w-10 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/30" />

        {/* Avatar in circle */}
        <div className="relative mt-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-purple-400/50 bg-gradient-to-br from-purple-400 to-indigo-600 text-3xl font-black text-white shadow-xl">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" crossOrigin="anonymous" />
          ) : (
            profile.full_name.charAt(0) || 'Z'
          )}
        </div>

        {/* Name */}
        <h3 className="mt-3 text-lg font-black text-white">{profile.full_name}</h3>

        {/* Level + Points */}
        <div className="mt-3 flex w-full justify-between rounded-xl bg-white/5 px-4 py-2 text-center">
          <div>
            <p className="text-[10px] text-purple-300">المستوى</p>
            <p className="text-lg font-black text-blue-300">{profile.level}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-[10px] text-purple-300">النقاط</p>
            <p className="text-lg font-black text-amber-400">{profile.points}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-3 flex gap-2">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${i < profile.level ? 'bg-amber-400/20' : 'bg-white/5'}`}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div className="mt-auto w-full">
          <div className="mb-1 flex justify-between text-[9px] text-white/50">
            <span>XP</span>
            <span>المستوى {profile.level + 1}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-500"
              style={{ width: `${Math.min(100, (profile.points % 100))}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
);
GamerCard.displayName = 'GamerCard';

/* Card 5: Zodiac Card (vertical) */
export const ZodiacVerticalCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => {
    const sign = profile.birth_date ? getZodiacSign(profile.birth_date) : null;

    return (
      <div
        ref={ref}
        dir="rtl"
        className={`relative flex h-96 w-64 flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br ${sign?.gradient || 'from-indigo-500 to-purple-700'} p-5 font-cairo`}
        style={{ width: 256, height: 384 }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        {/* Header */}
        <div className="relative self-start text-xs font-bold text-white/80">برجي</div>

        {/* Big zodiac symbol */}
        <div className="relative mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-white/15 text-6xl backdrop-blur">
          {sign?.symbol || '⭐'}
        </div>

        {/* Zodiac name */}
        <h3 className="relative mt-4 text-2xl font-black text-white">{sign?.name || 'غير محدد'}</h3>

        {/* Birth date */}
        <p className="relative mt-2 text-xs text-white/70">
          {profile.birth_date || '—'}
        </p>

        {/* Message */}
        <div className="relative mt-4 rounded-xl bg-white/15 px-4 py-3 text-center backdrop-blur">
          <p className="text-xs leading-relaxed text-white/90">
            {sign?.message || 'اكمل بياناتك لمعرفة برجك'}
          </p>
        </div>

        {/* Bottom logo */}
        <BrandLogo imageClassName="relative mt-auto h-10 w-10 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/20" />
      </div>
    );
  }
);
ZodiacVerticalCard.displayName = 'ZodiacVerticalCard';

/* Card 6: Birthday Card (vertical) */
export const BirthdayCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => {
    const age = getAgeYears(profile.birth_date);

    return (
      <div
        ref={ref}
        dir="rtl"
        className="relative flex h-96 w-64 flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 p-5 font-cairo"
        style={{ width: 256, height: 384 }}
      >
        {/* Balloons + confetti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {['🎈', '🎉', '🎂', '🎈', '🎊', '🎁', '✨', '🎈'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-xl"
              style={{
                left: `${(i * 23) % 90 + 5}%`,
                top: `${(i * 31) % 80}%`,
                opacity: 0.6,
                transform: `rotate(${i * 45}deg)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <BrandLogo imageClassName="absolute right-5 top-5 h-10 w-10 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/20" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mt-4 text-5xl">🎂</div>
          <h3 className="mt-3 text-2xl font-black text-white drop-shadow-lg">عيد ميلاد سعيد</h3>
          <h4 className="mt-2 text-lg font-bold text-white/90">{profile.full_name}</h4>

          {/* Age */}
          <div className="mt-4 rounded-full bg-white/20 px-6 py-2 text-xl font-black text-white backdrop-blur">
            {age} سنة
          </div>

          {/* Message */}
          <p className="mt-4 text-xs leading-relaxed text-white/90">
            كل سنة وإنت طيب! ربنا يحقق لك كل أمنياتك 🎂🎉
          </p>

          {/* Date */}
          <p className="mt-3 text-[10px] text-white/60">
            {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>

        <BrandLogo imageClassName="relative mt-auto h-10 w-10 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/20" />
      </div>
    );
  }
);
BirthdayCard.displayName = 'BirthdayCard';

/* Card 7: Motivation Poster (vertical) */
export const MotivationPosterCard = forwardRef<HTMLDivElement, CardProps>(
  ({ profile }, ref) => {
    const quotes = [
      'النجاح رحلة وليست وجهة',
      'كل يوم فرصة جديدة للتعلم',
      'إصرارك هو مفتاح نجاحك',
      'العلم نور والجهل ظلام',
      'احلم كبير واسعى أكبر',
    ];
    const quote = quotes[profile.full_name.charCodeAt(0) % quotes.length];

    return (
      <div
        ref={ref}
        dir="rtl"
        className="relative flex h-96 w-64 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 font-cairo"
        style={{ width: 256, height: 384 }}
      >
        {/* Cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

        {/* Gold accent line */}
        <div className="absolute top-8 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 text-3xl">🎯</div>
          <h3 className="text-xl font-black leading-snug text-white drop-shadow-2xl">
            {quote}
          </h3>

          {/* Decorative line */}
          <div className="my-4 h-px w-16 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />

          <p className="text-sm font-bold text-amber-400">{profile.full_name}</p>
        </div>

        {/* Bottom logo */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <BrandLogo imageClassName="h-12 w-12 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/40" />
          <span className="mt-1 text-[8px] font-bold tracking-widest text-amber-400/80">ZEIN NOTE</span>
        </div>

        {/* Top logo */}
        <BrandLogo imageClassName="absolute right-5 top-5 h-8 w-8 rounded bg-white/10 p-0.5 shadow-lg shadow-black/40" />
      </div>
    );
  }
);
MotivationPosterCard.displayName = 'MotivationPosterCard';

/* Achievement data type */
export type AchievementData = {
  id: string;
  type: 'certificate' | 'achievement';
  title: string;
  description: string;
  points_awarded: number;
  issued_at: string;
};

/* Certificate Card — data-driven (for admin-issued certificates) */
export const CertificateDataCard = forwardRef<
  HTMLDivElement,
  { profile: Profile; achievement: AchievementData }
>(
  ({ profile, achievement }, ref) => (
    <div
      ref={ref}
      dir="rtl"
      className="relative flex h-52 w-80 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 font-cairo"
      style={{ width: 320, height: 220 }}
    >
      <div className="absolute inset-2 rounded-xl border-4 border-amber-500/60" />
      <div className="absolute inset-3 rounded-lg border border-blue-700/40" />

      <div className="absolute right-2 top-2 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-blue-700" />
      <div className="absolute left-2 top-2 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-blue-700" />
      <div className="absolute right-2 bottom-2 h-8 w-8 rounded-br-lg border-r-4 border-b-4 border-blue-700" />
      <div className="absolute left-2 bottom-2 h-8 w-8 rounded-bl-lg border-l-4 border-b-4 border-blue-700" />

      <BrandLogo imageClassName="absolute right-4 top-4 h-10 w-10 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/20" />
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-1 flex flex-col items-center">
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <BrandLogo imageClassName="h-10 w-20 object-contain" />
          <span className="text-[9px] font-bold tracking-widest text-blue-800">ZEIN NOTE</span>
        </div>

        <h3 className="text-xl font-black text-amber-700">{achievement.title || 'شهادة تقدير'}</h3>
        <p className="mt-1 text-[10px] text-gray-500">تُمنح إلى</p>
        <h4 className="text-base font-black text-blue-900">{profile.full_name}</h4>
        <p className="mt-1 max-w-[240px] text-[10px] leading-snug text-gray-500">{achievement.description}</p>
        <div className="mt-2 flex items-center gap-4 text-[9px] text-gray-400">
          <span>{profile.grade}</span>
          <span>{new Date(achievement.issued_at).toLocaleDateString('ar-EG')}</span>
        </div>
      </div>
    </div>
  )
);
CertificateDataCard.displayName = 'CertificateDataCard';

/* Achievement Card — data-driven (for admin-issued achievements) */
export const AchievementDataCard = forwardRef<
  HTMLDivElement,
  { profile: Profile; achievement: AchievementData }
>(
  ({ profile, achievement }, ref) => (
    <div
      ref={ref}
      dir="rtl"
      className="relative flex h-48 w-80 flex-col items-center justify-center overflow-hidden rounded-2xl bg-black p-5 font-cairo"
      style={{ width: 320, height: 200 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: ((i * 7) % 10) / 10 + 0.2,
            }}
          />
        ))}
      </div>

      <BrandLogo imageClassName="absolute right-4 top-4 h-9 w-9 rounded-lg bg-white/10 p-1 shadow-lg shadow-black/30" />
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/50">
          <span className="text-3xl">🏆</span>
        </div>
        <h3 className="text-lg font-black text-amber-400">{achievement.title || 'إنجاز جديد'}</h3>
        <p className="mt-1 max-w-[260px] text-xs leading-snug text-white/70">{achievement.description}</p>

        {achievement.points_awarded > 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1 text-sm font-bold text-amber-400">
            +{achievement.points_awarded} نقطة
          </div>
        )}

        <p className="mt-2 text-[9px] text-white/40">
          {new Date(achievement.issued_at).toLocaleDateString('ar-EG')}
        </p>
      </div>
    </div>
  )
);
AchievementDataCard.displayName = 'AchievementDataCard';
