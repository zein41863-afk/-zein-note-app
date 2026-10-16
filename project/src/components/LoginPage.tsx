import { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowLeft, LogIn, UserPlus, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BrandLogo from '@/components/BrandLogo';

type LoginPageProps = {
  onBack: () => void;
};

function LoginPage({ onBack }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [signupGrade, setSignupGrade] = useState('الأول الإعدادي');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (!trimmedEmail || !password || loading) return;
    if (mode === 'signup' && !trimmedName) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { full_name: trimmedName, grade: signupGrade },
          },
        });

        if (signUpError) {
          setErrorMsg(signUpError.message);
        } else if (data.user) {
          window.location.href = '/';
          return;
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          setErrorMsg(signInError.message);
        } else if (data.user) {
          window.location.href = '/';
          return;
        }
      }
    } catch {
      setErrorMsg('حدث خطأ غير متوقع، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMsg('');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zen-bg px-4 py-8">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-zen-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-zen-gold/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-tajawal text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg sm:p-10">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center text-center">
            <BrandLogo imageClassName="h-28 w-28 rounded-3xl shadow-2xl shadow-zen-blue/30 sm:h-32 sm:w-32" />
            <p className="mt-3 font-cairo text-lg font-bold text-zen-gold">أهلاً بك في زين نوت 🎓</p>
            <h1 className="mt-2 font-cairo text-2xl font-black text-white sm:text-3xl">
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>
            <p className="mt-3 font-tajawal text-sm text-white/60">
              {mode === 'login'
                ? 'سجّل دخولك للمتابعة في زين نوت'
                : 'انضم لزين نوت وابدأ رحلتك التعليمية'}
            </p>
            <p className="mt-2 font-tajawal text-xs text-zen-gold/80">للصف الأول الإعدادي حالياً - التوسع للثاني والثالث قريباً</p>
          </div>

          {/* Mode tabs */}
          <div className="mb-6 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 font-cairo text-sm font-bold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-zen-blue text-white shadow-lg shadow-zen-blue/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <LogIn className="h-4 w-4" />
              دخول
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 font-cairo text-sm font-bold transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-zen-gold text-zen-bg shadow-lg shadow-zen-gold/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              تسجيل
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (signup only) */}
            {mode === 'signup' && (
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
            )}

            {/* Grade */}
            {mode === 'signup' && (
              <div>
                <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">الصف الدراسي</label>
                <div className="grid grid-cols-3 gap-2">
                  {['الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي'].map((grade) => {
                    const isSelected = signupGrade === grade;
                    const isComingSoon = grade !== 'الأول الإعدادي';
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setSignupGrade(grade)}
                        className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${isSelected ? 'border-zen-gold bg-zen-gold/20 text-zen-gold' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'}`}
                      >
                        {grade.replace(' الإعدادي', '')}
                        {isComingSoon && <span className="mt-1 block text-[10px] text-white/40">(قريباً)</span>}
                      </button>
                    );
                  })}
                </div>
                {signupGrade !== 'الأول الإعدادي' && <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60">الصف ده هيبدأ قريب، سجّل وهنبلغك لما يفتح!</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-11 pl-4 font-tajawal text-white placeholder-white/30 transition-colors focus:border-zen-blue focus:outline-none focus:ring-2 focus:ring-zen-blue/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-tajawal text-sm font-medium text-white/80">
                كلمة السر
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-11 pl-11 font-tajawal text-white placeholder-white/30 transition-colors focus:border-zen-blue focus:outline-none focus:ring-2 focus:ring-zen-blue/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 font-tajawal text-sm text-red-300">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password || (mode === 'signup' && !fullName.trim())}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-cairo text-base font-bold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                mode === 'login'
                  ? 'bg-zen-blue shadow-zen-blue/30 hover:bg-blue-600'
                  : 'bg-zen-gold text-zen-bg shadow-zen-gold/30 hover:bg-amber-600 hover:text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {mode === 'login' ? 'جاري الدخول...' : 'جاري الإنشاء...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      <LogIn className="h-5 w-5" />
                      تسجيل الدخول
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-5 w-5" />
                      إنشاء حساب
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="font-tajawal text-sm text-white/60">
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="font-cairo font-bold text-zen-gold transition-colors hover:text-amber-400"
                >
                  سجّل الآن
                </button>
              </p>
            ) : (
              <p className="font-tajawal text-sm text-white/60">
                لديك حساب؟{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="font-cairo font-bold text-zen-blue transition-colors hover:text-blue-400"
                >
                  سجّل الدخول
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
