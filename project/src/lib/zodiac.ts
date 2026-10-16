export type ZodiacSign = {
  name: string;
  symbol: string;
  message: string;
  gradient: string;
};

export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: { name: 'الحمل', symbol: '♈', message: 'روحك الحماسية بتلهم كل اللي حواليك! استمر 🚀', gradient: 'from-red-500 to-orange-500' },
  taurus: { name: 'الثور', symbol: '♉', message: 'إصرارك وصبرك هما سر نجاحك! متتخلى عن حلمك 💪', gradient: 'from-green-500 to-emerald-600' },
  gemini: { name: 'الجوزاء', symbol: '♊', message: 'عقلك السريع وشغفك بالمعرفة ميزتك الكبيرة! اسأل دايماً 🧠', gradient: 'from-yellow-400 to-amber-500' },
  cancer: { name: 'السرطان', symbol: '♋', message: 'قلبك الطيب وحسك المرهف بيميزوك! ثق بمشاعرك 🌊', gradient: 'from-slate-400 to-slate-600' },
  leo: { name: 'الأسد', symbol: '♌', message: 'أنت قائد بالفطرة! ثقتك بنفسك هتوصلك للقمة 🦁', gradient: 'from-amber-500 to-orange-600' },
  virgo: { name: 'العذراء', symbol: '♍', message: 'دقتك وتركيزك في التفاصيل هما سر تميزك! استمر ✨', gradient: 'from-teal-500 to-green-600' },
  libra: { name: 'الميزان', symbol: '♎', message: 'توازنك وعدلك بيخليك محبوب من الكل! أنت مميز ⚖️', gradient: 'from-pink-400 to-rose-500' },
  scorpio: { name: 'العقرب', symbol: '♏', message: 'عمقك وقوتك الداخلية بيميزوك عن غيرك! واصل 🔥', gradient: 'from-red-600 to-red-900' },
  sagittarius: { name: 'القوس', symbol: '♐', message: 'روحك المغامرة وحبك للاكتشاف هما كنزك! اقفز نحو أحلامك 🏹', gradient: 'from-purple-500 to-indigo-600' },
  capricorn: { name: 'الجدي', symbol: '♑', message: 'طموحك وانضباطك هيوصلك للقمة! متوقفش 🌟', gradient: 'from-gray-600 to-gray-900' },
  aquarius: { name: 'الدلو', symbol: '♒', message: 'تفكيرك المبتكر وأفكارك الجديدة بيميزوك! أنت المستقبل 💡', gradient: 'from-cyan-400 to-blue-500' },
  pisces: { name: 'الحوت', symbol: '♓', message: 'خيالك الواسع وإبداعك هما موهبتك! اطلقها 🎨', gradient: 'from-indigo-400 to-purple-500' },
};

export function getZodiacSign(birthDate: string): ZodiacSign | null {
  if (!birthDate) return null;

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return null;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const ranges: { sign: string; from: [number, number]; to: [number, number] }[] = [
    { sign: 'aries', from: [3, 21], to: [4, 19] },
    { sign: 'taurus', from: [4, 20], to: [5, 20] },
    { sign: 'gemini', from: [5, 21], to: [6, 20] },
    { sign: 'cancer', from: [6, 21], to: [7, 22] },
    { sign: 'leo', from: [7, 23], to: [8, 22] },
    { sign: 'virgo', from: [8, 23], to: [9, 22] },
    { sign: 'libra', from: [9, 23], to: [10, 22] },
    { sign: 'scorpio', from: [10, 23], to: [11, 21] },
    { sign: 'sagittarius', from: [11, 22], to: [12, 21] },
    { sign: 'capricorn', from: [12, 22], to: [1, 19] },
    { sign: 'aquarius', from: [1, 20], to: [2, 18] },
    { sign: 'pisces', from: [2, 19], to: [3, 20] },
  ];

  for (const range of ranges) {
    const [fromMonth, fromDay] = range.from;
    const [toMonth, toDay] = range.to;
    if (fromMonth <= toMonth) {
      if (
        (month === fromMonth && day >= fromDay) ||
        (month === toMonth && day <= toDay) ||
        (month > fromMonth && month < toMonth)
      ) {
        return zodiacSigns[range.sign];
      }
    } else {
      if (
        (month === fromMonth && day >= fromDay) ||
        (month === toMonth && day <= toDay) ||
        month > fromMonth ||
        month < toMonth
      ) {
        return zodiacSigns[range.sign];
      }
    }
  }

  return null;
}

export function calculateExactAge(birthDate: string): string | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} سنة`);
  if (months > 0) parts.push(`${months} شهر`);
  if (days > 0) parts.push(`${days} يوم`);
  if (parts.length === 0) return 'عمرك: أقل من يوم';

  return `عمرك: ${parts.join(' و ')}`;
}

export function getBirthdayCountdown(birthDate: string): { days: number; isToday: boolean } | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  thisYearBirthday.setHours(0, 0, 0, 0);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((thisYearBirthday.getTime() - now.getTime()) / oneDay);

  if (diffDays === 0) {
    return { days: 0, isToday: true };
  }

  if (diffDays > 0) {
    return { days: diffDays, isToday: false };
  }

  const nextYearBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  nextYearBirthday.setHours(0, 0, 0, 0);
  const nextDiffDays = Math.round((nextYearBirthday.getTime() - now.getTime()) / oneDay);
  return { days: nextDiffDays, isToday: false };
}
