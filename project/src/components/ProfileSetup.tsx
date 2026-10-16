import { useState } from 'react';
import { User, Calendar, GraduationCap, BookUser, Save, Loader2, GraduationCap as GradIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/BrandLogo';

function ProfileSetup() {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [grade, setGrade] = useState((user?.user_metadata?.grade as string | undefined) ?? 'الأول الإعدادي');
  const [accountType, setAccountType] = useState<'student' | 'parent'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !fullName.trim() || loading) return;

    setLoading(true);
    setError(false);

    try {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          birth_date: birthDate || null,
          grade,
          account_type: accountType,
          points: 0,
          level: 1,
        });

      if (upsertError) {
        setError(true);
      } else {
        await refreshProfile();
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zen-bg px-4 py-8">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute top-0 left-0 h-72 w-72 rounded-full bg-zen-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zen-blue/20 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg sm:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <BrandLogo imageClassName="mb-4 h-24 w-24 rounded-2xl shadow-xl shadow-zen-gold/20" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-zen-gold to-amber-600 shadow-lg shadow-zen-gold/30">
              <GradIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-cairo text-2xl font-black text-white">أكمل بياناتك</h1>
            <p className="mt-2 font-tajawal text-sm text-white/60">
              خطوة أخيرة لنبدأ رحلتك التعليمية
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="اكتب اسمك الكامل"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-11 pl-4 font-tajawal text-white placeholder-white/30 transition-colors focus:border-zen-blue focus:outline-none focus:ring-2 focus:ring-zen-blue/30"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                تاريخ الميلاد
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 pointer-events-none" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-11 pl-4 font-tajawal text-white transition-colors focus:border-zen-blue focus:outline-none focus:ring-2 focus:ring-zen-blue/30"
                />
              </div>
            </div>

            {/* Grade (pre-selected) */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                الصف الدراسي
              </label>
              <div className="relative">
                <GraduationCap className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  value={grade}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-zen-gold/30 bg-zen-gold/10 py-3 pr-11 pl-4 font-tajawal text-white"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                نوع الحساب
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('student')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-tajawal text-sm font-medium transition-all duration-300 ${
                    accountType === 'student'
                      ? 'border-zen-blue bg-zen-blue text-white shadow-lg shadow-zen-blue/30'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                  طالب
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('parent')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-tajawal text-sm font-medium transition-all duration-300 ${
                    accountType === 'parent'
                      ? 'border-zen-gold bg-zen-gold text-zen-bg shadow-lg shadow-zen-gold/30'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <BookUser className="h-5 w-5" />
                  ولي أمر
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 font-tajawal text-sm text-red-300">
                حدث خطأ أثناء الحفظ، حاول مرة أخرى
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zen-blue py-3.5 font-cairo text-base font-bold text-white shadow-lg shadow-zen-blue/30 transition-all duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  احفظ وابدأ
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
