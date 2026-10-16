import { useState } from 'react';
import ChatPage from '@/components/ChatPage';
import LoginPage from '@/components/LoginPage';
import ProfileSetup from '@/components/ProfileSetup';
import AccountPage from '@/components/AccountPage';
import AuthGate from '@/components/AuthGate';
import ZodiacCard from '@/components/ZodiacCard';
import PointsBar from '@/components/PointsBar';
import PointsHistoryPage from '@/components/PointsHistoryPage';
import MyCardsPage from '@/components/MyCardsPage';
import SubjectPage from '@/components/SubjectPage';
import MainLayout from '@/components/MainLayout';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  BookOpen,
  Bot,
  Trophy,
  User,
  Calculator,
  FlaskConical,
  BookMarked,
  Globe,
  Languages,
  Palette,
  Sparkles,
  ChevronLeft,
  GraduationCap,
  Heart,
  Loader2,
  Coins,
  Layers,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'subjects', label: 'المواد', icon: BookOpen },
  { id: 'ai-teacher', label: 'المدرس الذكي', icon: Bot },
  { id: 'contests', label: 'المسابقات', icon: Trophy },
  { id: 'points', label: 'نقاطي', icon: Coins },
  { id: 'my-cards', label: 'كروتي', icon: Layers },
  { id: 'account', label: 'حسابي', icon: User },
];

type Subject = {
  id: string;
  name: string;
  emoji: string;
  icon: typeof Calculator;
  lessons: number;
  color: string;
  hoverColor: string;
  accent: string;
};

const subjects: Subject[] = [
  {
    id: 'math',
    name: 'رياضيات',
    emoji: '📐',
    icon: Calculator,
    lessons: 24,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:shadow-blue-500/50',
    accent: 'bg-[#2196F3]',
  },
  {
    id: 'science',
    name: 'علوم',
    emoji: '🔬',
    icon: FlaskConical,
    lessons: 18,
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'hover:shadow-green-500/50',
    accent: 'bg-[#4CAF50]',
  },
  {
    id: 'arabic',
    name: 'عربي',
    emoji: '📖',
    icon: BookMarked,
    lessons: 20,
    color: 'from-amber-500 to-orange-600',
    hoverColor: 'hover:shadow-amber-500/50',
    accent: 'bg-[#FF9800]',
  },
  {
    id: 'social',
    name: 'دراسات',
    emoji: '🌍',
    icon: Globe,
    lessons: 16,
    color: 'from-teal-500 to-cyan-600',
    hoverColor: 'hover:shadow-teal-500/50',
    accent: 'bg-[#795548]',
  },
  {
    id: 'english',
    name: 'إنجليزي',
    emoji: '🇬🇧',
    icon: Languages,
    lessons: 22,
    color: 'from-rose-500 to-pink-600',
    hoverColor: 'hover:shadow-rose-500/50',
    accent: 'bg-[#9C27B0]',
  },
  {
    id: 'art',
    name: 'فنون',
    emoji: '🎨',
    icon: Palette,
    lessons: 12,
    color: 'from-purple-500 to-fuchsia-600',
    hoverColor: 'hover:shadow-purple-500/50',
    accent: 'bg-[#E91E63]',
  },
];

type Page = 'home' | 'chat' | 'login' | 'account' | 'profile-setup' | 'points' | 'my-cards' | 'subject';

function App() {
  const { loading, user, profile, needsProfileSetup } = useAuth();
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const goHome = () => {
    setPage('home');
    setActiveNav('home');
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setPage('subject');
    setActiveNav('subjects');
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);

    if (id === 'subjects') {
      setPage('home');
      window.setTimeout(
        () => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        0,
      );
    } else if (id === 'ai-teacher') {
      if (!user) {
        setPage('login');
      } else if (needsProfileSetup) {
        setPage('profile-setup');
      } else {
        setPage('chat');
      }
    } else if (id === 'account') {
      if (!user) {
        setPage('login');
      } else if (needsProfileSetup) {
        setPage('profile-setup');
      } else {
        setPage('account');
      }
    } else if (id === 'points') {
      if (!user) {
        setPage('login');
      } else if (needsProfileSetup) {
        setPage('profile-setup');
      } else {
        setPage('points');
      }
    } else if (id === 'my-cards') {
      if (!user) {
        setPage('login');
      } else if (needsProfileSetup) {
        setPage('profile-setup');
      } else {
        setPage('my-cards');
      }
    } else {
      setPage('home');
    }
  };

  // Loading screen — no nav needed
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zen-bg">
        <BrandLogo imageClassName="h-24 w-24 animate-pulse rounded-2xl shadow-2xl shadow-zen-blue/30" />
        <Loader2 className="h-8 w-8 animate-spin text-zen-blue" />
      </div>
    );
  }

  // Login page — standalone, no bottom nav (user is not signed in yet)
  if (page === 'login') {
    return <LoginPage onBack={goHome} />;
  }

  // Profile setup page
  if (page === 'profile-setup' && user && needsProfileSetup) {
    return (
      <MainLayout
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogin={() => setPage('login')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        fullNavItems={navItems}
      >
        <ProfileSetup />
      </MainLayout>
    );
  }

  // Subject page
  if (page === 'subject' && selectedSubject) {
    return (
      <MainLayout
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogin={() => setPage('login')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        fullNavItems={navItems}
      >
        <SubjectPage subject={selectedSubject} onBack={goHome} />
      </MainLayout>
    );
  }

  // Account page — requires auth + complete profile
  if (page === 'account') {
    if (!user) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="not-authenticated"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    if (needsProfileSetup) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="needs-profile"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    if (profile) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AccountPage onBack={goHome} />
        </MainLayout>
      );
    }
  }

  // Points history page — requires auth + complete profile
  if (page === 'points') {
    if (!user) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="not-authenticated"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    if (needsProfileSetup) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="needs-profile"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    return (
      <MainLayout
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogin={() => setPage('login')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        fullNavItems={navItems}
      >
        <PointsHistoryPage onBack={goHome} />
      </MainLayout>
    );
  }

  // My cards page — requires auth + complete profile
  if (page === 'my-cards') {
    if (!user) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="not-authenticated"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    if (needsProfileSetup) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="needs-profile"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    return (
      <MainLayout
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogin={() => setPage('login')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        fullNavItems={navItems}
      >
        <MyCardsPage onBack={goHome} />
      </MainLayout>
    );
  }

  // Chat page — requires auth + complete profile
  if (page === 'chat') {
    if (!user) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="not-authenticated"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    if (needsProfileSetup) {
      return (
        <MainLayout
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={() => setPage('login')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fullNavItems={navItems}
        >
          <AuthGate
            reason="needs-profile"
            onBack={goHome}
            onLogin={() => setPage('login')}
            onCompleteProfile={() => setPage('profile-setup')}
          />
        </MainLayout>
      );
    }
    return (
      <MainLayout
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogin={() => setPage('login')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        fullNavItems={navItems}
      >
        <ChatPage onBack={goHome} />
      </MainLayout>
    );
  }

  // Home page
  return (
    <MainLayout
      activeNav={activeNav}
      onNavClick={handleNavClick}
      onLogin={() => setPage('login')}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      fullNavItems={navItems}
    >
      {/* Grade availability notice */}
      <button
        onClick={() => setNoticeOpen(true)}
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl border border-zen-gold/30 bg-zen-gold/20 px-4 py-3 text-center font-tajawal text-sm font-medium text-amber-100 transition-colors hover:bg-zen-gold/30 sm:mx-6 sm:w-[calc(100%-3rem)] lg:mx-8 lg:w-[calc(100%-4rem)]"
      >
        <GraduationCap className="h-4 w-4 shrink-0 text-zen-gold" />
        🎓 المنصة حالياً للصف الأول الإعدادي - الثاني والثالث قريباً!
      </button>

      {/* Welcome Section */}
      <section className="relative overflow-hidden px-4 pt-8 pb-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-zen-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute top-20 left-0 h-72 w-72 rounded-full bg-zen-gold/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zen-gold/30 bg-zen-gold/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-zen-gold" />
              <span className="font-tajawal text-sm text-zen-gold">الصف الأول الإعدادي</span>
            </div>
            <h1 className="font-cairo text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              أهلاً يا بطل <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="mt-4 max-w-2xl font-tajawal text-lg text-white/70">
              منصة زين نوت التعليمية — تعلّم بمتعة وتفاعل مع أفضل الدروس والمدرس الذكي والمسابقات
            </p>

            <div className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-4">
              {[
                { label: 'مواد دراسية', value: '6', icon: BookOpen },
                { label: 'دروس', value: '112', icon: GraduationCap },
                { label: 'مسابقات', value: '15', icon: Trophy },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm"
                  >
                    <Icon className="mx-auto mb-2 h-6 w-6 text-zen-blue" />
                    <div className="font-cairo text-2xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 font-tajawal text-xs text-white/60">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Zodiac Card + Points Bar */}
      {user && profile && !needsProfileSetup && (
        <section className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
          <ZodiacCard fullName={profile.full_name} birthDate={profile.birth_date} />
          <PointsBar />
        </section>
      )}

      {/* Subjects Section */}
      <section id="subjects" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-cairo text-2xl font-bold text-white sm:text-3xl">المواد الدراسية</h2>
              <p className="mt-1 font-tajawal text-sm text-white/60">اختر المادة لبدء التعلم</p>
            </div>
            <button className="hidden items-center gap-1 rounded-lg border border-white/10 px-4 py-2 font-tajawal text-sm text-white/70 transition-colors hover:bg-white/10 sm:flex">
              عرض الكل
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject)}
                  className={`group rounded-2xl border border-white/10 bg-[#1A2540] p-3 text-right shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl ${subject.hoverColor}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${subject.accent} text-white shadow-md transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-cairo text-sm font-bold text-white sm:text-base">{subject.name}</h3>
                    <span className="text-base">{subject.emoji}</span>
                  </div>
                  <p className="mt-1 font-tajawal text-[11px] text-white/50">{subject.lessons} درس</p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${subject.accent}`}
                      style={{ width: `${30 + index * 12}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Teacher Section */}
      <section id="ai-teacher" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-zen-gold/20 bg-gradient-to-br from-zen-bg via-zen-bg to-blue-950 p-8 sm:p-12">
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-zen-gold/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-zen-blue/20 blur-2xl" />

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-zen-gold to-amber-600 shadow-lg shadow-zen-gold/30 animate-pulse-glow">
                <Bot className="h-10 w-10 text-white" />
              </div>

              <h2 className="font-cairo text-3xl font-black text-white sm:text-4xl">المدرس الذكي</h2>
              <p className="mt-3 max-w-xl font-tajawal text-base text-white/70 sm:text-lg">
                محادثة فورية مع مدرس ذكي يجيب على أسئلتك في كل المواد، يشرح الدروس بطريقة مبسطة، ويساعدك على المراجعة
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {['شرح فوري', 'أسئلة وأجوبة', 'مراجعة ذكية'].map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-tajawal text-sm text-white/80"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleNavClick('ai-teacher')}
                className="mt-8 flex items-center gap-3 rounded-2xl bg-zen-gold px-8 py-4 font-cairo text-lg font-bold text-zen-bg shadow-lg shadow-zen-gold/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-zen-gold/40 active:scale-100"
              >
                <Bot className="h-6 w-6" />
                ابدأ المحادثة
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <BrandLogo
              imageClassName="h-14 w-14 rounded-xl shadow-lg shadow-zen-blue/30"
              showName
              nameClassName="text-lg text-white"
              link
            />

            <nav className="flex flex-wrap justify-center gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="font-tajawal text-sm text-white/60 transition-colors hover:text-zen-gold"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 font-tajawal text-sm text-white/50">
              <span>صُنع بكل</span>
              <Heart className="h-4 w-4 fill-zen-gold text-zen-gold" />
              <span>لطلاب مصر</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-6 text-center">
            <p className="font-tajawal text-xs text-white/50">
              المنصة حالياً للصف الأول الإعدادي - التوسع للثاني والثالث قريباً
            </p>
            <p className="mt-2 font-tajawal text-sm text-white/40">© 2026 زين نوت — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      {noticeOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setNoticeOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl border border-zen-gold/30 bg-[#1A2540] p-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zen-gold/20 text-zen-gold">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="font-cairo text-2xl font-black text-white">مرحباً بك في زين نوت 🎓</h2>
            <p className="mt-4 whitespace-pre-line font-tajawal leading-8 text-white/70">
              المنصة حالياً بتخدم طلاب الصف الأول الإعدادي.{'\n'}الصف الثاني والثالث الإعدادي جايين قريب جداً! 🚀{'\n'}
              تابعنا وهتكون أول من يعرف.
            </p>
            <button
              onClick={() => setNoticeOpen(false)}
              className="mt-6 w-full rounded-xl bg-zen-gold py-3 font-cairo font-bold text-zen-bg transition-colors hover:bg-amber-500"
            >
              تمام، فهمت
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
