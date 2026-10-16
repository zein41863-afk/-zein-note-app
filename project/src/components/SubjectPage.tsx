import { ArrowRight, BookOpen, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

type SubjectPageProps = {
  subject: {
    name: string;
    lessons: number;
    accent: string;
    icon: typeof BookOpen;
  };
  onBack: () => void;
};

function SubjectPage({ subject, onBack }: SubjectPageProps) {
  const Icon = subject.icon;
  const lessonItems = Array.from({ length: subject.lessons }, (_, index) => ({
    title: `الدرس ${index + 1}`,
    completed: index < Math.floor(subject.lessons * 0.35),
  }));

  return (
    <div className="min-h-screen bg-zen-bg px-4 py-8 font-tajawal text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
          <ArrowRight className="h-4 w-4" />
          العودة للمواد
        </button>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A2540] p-6 sm:p-8">
          <div className={`absolute -left-12 -top-12 h-40 w-40 rounded-full ${subject.accent} opacity-20 blur-3xl`} />
          <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-right">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${subject.accent} text-white shadow-lg`}>
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                <BrandLogo imageClassName="h-8 w-8 rounded-lg shadow-md" />
                <span className="text-xs text-white/50">زين نوت · الصف الأول الإعدادي</span>
              </div>
              <h1 className="font-cairo text-3xl font-black">مادة {subject.name}</h1>
              <p className="mt-2 text-sm text-white/60">استكشف دروس المادة وتابع تقدمك خطوة بخطوة.</p>
            </div>
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#1A2540] p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/60">التقدم في المادة</span>
            <span className="font-cairo font-bold text-zen-gold">35%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full w-[35%] rounded-full ${subject.accent}`} />
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {lessonItems.map((lesson) => (
            <button key={lesson.title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A2540] p-4 text-right transition-all hover:-translate-y-0.5 hover:border-zen-blue/50">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${lesson.completed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                {lesson.completed ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </div>
              <span className="flex-1 font-cairo text-sm font-bold text-white">{lesson.title}</span>
              {lesson.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <PlayCircle className="h-5 w-5 text-zen-blue" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;
