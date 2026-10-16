import { type ReactNode } from 'react';
import { Home, BookOpen, Bot, Trophy, User, Menu, X, LogIn } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

type MainLayoutProps = {
  children: ReactNode;
  activeNav: string;
  onNavClick: (id: string) => void;
  onLogin: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  fullNavItems: NavItem[];
};

const mobileNavItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'subjects', label: 'المواد', icon: BookOpen },
  { id: 'ai-teacher', label: 'المدرس', icon: Bot },
  { id: 'contests', label: 'المسابقات', icon: Trophy },
  { id: 'account', label: 'حسابي', icon: User },
];

function MainLayout({
  children,
  activeNav,
  onNavClick,
  onLogin,
  mobileMenuOpen,
  setMobileMenuOpen,
  fullNavItems,
}: MainLayoutProps) {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-zen-bg pb-20 font-tajawal text-zen-white md:mr-64 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zen-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <BrandLogo
            imageClassName="h-10 w-10 rounded-xl shadow-lg shadow-zen-blue/30 sm:h-12 sm:w-12"
            showName
            nameClassName="text-lg text-white sm:text-xl"
            link
          />

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile account menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-white/10 bg-zen-bg px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {fullNavItems
                .filter((item) => item.id === 'points' || item.id === 'my-cards')
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavClick(item.id)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-tajawal text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-5 w-5 text-zen-gold" />
                      {item.label}
                    </button>
                  );
                })}
              {user && profile ? (
                <button
                  onClick={() => onNavClick('account')}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-tajawal text-sm font-medium text-zen-gold transition-colors hover:bg-white/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zen-gold to-amber-600 font-cairo text-xs font-bold text-white">
                    {profile.full_name.charAt(0) || 'Z'}
                  </div>
                  {profile.full_name}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-tajawal text-sm font-medium text-zen-blue transition-colors hover:bg-white/10"
                >
                  <LogIn className="h-5 w-5" />
                  تسجيل الدخول
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed right-0 top-0 z-40 hidden h-screen w-64 flex-col border-l border-white/10 bg-[#0A1628] px-4 py-6 md:flex">
        <BrandLogo
          imageClassName="mx-auto h-16 w-16 rounded-2xl shadow-lg shadow-zen-blue/20"
          showName
          nameClassName="text-xl text-white"
          link
        />
        <nav className="mt-10 flex flex-col gap-2">
          {fullNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-right font-tajawal text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zen-blue text-white shadow-lg shadow-zen-blue/20'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        {!user && (
          <button
            onClick={onLogin}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-zen-blue/30 bg-zen-blue/10 px-4 py-3 font-tajawal text-sm font-medium text-zen-blue transition-colors hover:bg-zen-blue hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            تسجيل الدخول
          </button>
        )}
      </aside>

      {/* Page content */}
      {children}

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0A1628]/95 px-2 py-2 shadow-2xl backdrop-blur-lg md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 font-tajawal text-[10px] transition-colors ${
                  isActive ? 'bg-zen-blue/20 text-zen-blue' : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default MainLayout;
