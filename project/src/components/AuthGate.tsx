import { Lock, FileEdit, LogIn, ArrowRight, GraduationCap } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

type AuthGateProps = {
  reason: 'not-authenticated' | 'needs-profile';
  onBack: () => void;
  onLogin: () => void;
  onCompleteProfile: () => void;
};

function AuthGate({ reason, onBack, onLogin, onCompleteProfile }: AuthGateProps) {
  const isNotAuth = reason === 'not-authenticated';

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
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg sm:p-10">
          <BrandLogo imageClassName="mx-auto mb-5 h-24 w-24 rounded-2xl shadow-xl shadow-zen-blue/20" />
          {/* Icon */}
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg ${
              isNotAuth
                ? 'bg-zen-blue/20 text-zen-blue shadow-zen-blue/20'
                : 'bg-zen-gold/20 text-zen-gold shadow-zen-gold/20'
            }`}
          >
            {isNotAuth ? <Lock className="h-10 w-10" /> : <FileEdit className="h-10 w-10" />}
          </div>

          {/* Message */}
          <p className="mb-8 font-cairo text-lg font-bold text-white sm:text-xl">
            {isNotAuth ? (
              <span className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-zen-blue" />
                لازم تسجل دخول الأول عشان تتكلم مع المدرس الذكي
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FileEdit className="h-5 w-5 text-zen-gold" />
                كمّل بياناتك الأول عشان تبدأ
              </span>
            )}
          </p>

          {/* Action button */}
          {isNotAuth ? (
            <button
              onClick={onLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zen-blue py-3.5 font-cairo text-base font-bold text-white shadow-lg shadow-zen-blue/30 transition-all duration-300 hover:bg-blue-600"
            >
              <LogIn className="h-5 w-5" />
              تسجيل الدخول
            </button>
          ) : (
            <button
              onClick={onCompleteProfile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zen-gold py-3.5 font-cairo text-base font-bold text-zen-bg shadow-lg shadow-zen-gold/30 transition-all duration-300 hover:bg-amber-600 hover:text-white"
            >
              <GraduationCap className="h-5 w-5" />
              أكمل بياناتي
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthGate;
