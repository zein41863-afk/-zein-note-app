import { Cake, Sparkles } from 'lucide-react';
import { getZodiacSign, calculateExactAge, getBirthdayCountdown } from '@/lib/zodiac';

type ZodiacCardProps = {
  fullName: string;
  birthDate: string | null;
};

function ZodiacCard({ fullName, birthDate }: ZodiacCardProps) {
  if (!birthDate) return null;

  const sign = getZodiacSign(birthDate);
  const age = calculateExactAge(birthDate);
  const countdown = getBirthdayCountdown(birthDate);

  if (!sign || !age || !countdown) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-zen-gold/20 bg-gradient-to-br from-amber-900/30 via-purple-900/30 to-zen-bg p-6 backdrop-blur-lg sm:p-8">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-zen-gold/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/15 blur-2xl" />

        <div className="relative flex flex-col items-center text-center">
          {/* Greeting */}
          <h2 className="font-cairo text-xl font-bold text-white sm:text-2xl">
            أهلاً يا {fullName} <span className="inline-block animate-float">👋</span>
          </h2>

          {/* Zodiac symbol circle */}
          <div className={`mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${sign.gradient} text-4xl shadow-lg`}>
            {sign.symbol}
          </div>

          {/* Zodiac name */}
          <p className="mt-3 font-cairo text-lg font-bold text-zen-gold">
            {sign.symbol} برجك: {sign.name}
          </p>

          {/* Age */}
          <p className="mt-2 font-tajawal text-sm text-white/80 sm:text-base">
            {age}
          </p>

          {/* Zodiac message */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-zen-gold" />
              <p className="font-tajawal text-sm text-white/90 sm:text-base">
                {sign.message}
              </p>
            </div>
          </div>

          {/* Birthday countdown / celebration */}
          {countdown.isToday ? (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-zen-gold/40 bg-zen-gold/15 px-5 py-4">
              <Cake className="h-6 w-6 text-zen-gold" />
              <p className="font-cairo text-base font-black text-zen-gold sm:text-lg">
                عيد ميلاد سعيد! كل سنة وإنت طيب!
              </p>
              <Cake className="h-6 w-6 text-zen-gold" />
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Cake className="h-5 w-5 text-white/50" />
              <p className="font-tajawal text-sm text-white/70">
                باقي {countdown.days} يوم على عيد ميلادك 🎂
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZodiacCard;
