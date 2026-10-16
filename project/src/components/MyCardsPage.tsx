import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Download, Share2, Loader2, Layers, Award, IdCard, Gamepad2, Sparkles, Cake, Target, ScrollText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getTotalPoints, getLevelInfo } from '@/lib/points';
import type { Profile } from '@/lib/supabase';
import {
  StudentIdCard,
  GamerCard,
  ZodiacVerticalCard,
  BirthdayCard,
  MotivationPosterCard,
  AchievementDataCard,
  type AchievementData,
} from '@/components/cards/CardDesigns';
import BrandLogo from '@/components/BrandLogo';
import {
  CertificateCard,
  certificateStyles,
  type CertificateData,
} from '@/components/cards/CertificateDesigns';

type MyCardsPageProps = {
  onBack: () => void;
};

type CardProps = { profile: Profile; userId: string };

type SelfCardConfig = {
  id: string;
  title: string;
  description: string;
  icon: typeof IdCard;
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<CardProps> & React.RefAttributes<HTMLDivElement>>;
};

function MyCardsPage({ onBack }: MyCardsPageProps) {
  const { user, profile } = useAuth();
  const [livePoints, setLivePoints] = useState(0);
  const [activeTab, setActiveTab] = useState<'my-cards' | 'achievements'>('my-cards');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!user) return;
    getTotalPoints(user.id).then((pts) => setLivePoints(pts));

    setLoadingAchievements(true);

    Promise.all([
      supabase
        .from('student_achievements')
        .select('id, type, title, description, points_awarded, issued_at')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false }),
      supabase
        .from('certificates')
        .select('id, certificate_type, student_name, title, description, grade, subject, issue_date, metadata, status')
        .eq('student_id', user.id)
        .eq('status', 'active')
        .order('issue_date', { ascending: false }),
    ]).then(([achRes, certRes]) => {
      setAchievements((achRes.data as AchievementData[]) || []);
      setCertificates((certRes.data as CertificateData[]) || []);
      setLoadingAchievements(false);
    });
  }, [user]);

  if (!user || !profile) return null;

  const liveProfile: Profile = {
    ...profile,
    points: livePoints,
    level: getLevelInfo(livePoints).level,
  };

  const myCards: SelfCardConfig[] = [
    { id: 'student-id', title: 'كارت الطالب', description: 'بطاقة تعريف شخصية', icon: IdCard, Component: StudentIdCard },
    { id: 'gamer', title: 'كارت اللاعب', description: 'بطاقة اللاعب والمستوى', icon: Gamepad2, Component: GamerCard },
    { id: 'zodiac', title: 'كارت البرج', description: 'برجك وصفاتك', icon: Sparkles, Component: ZodiacVerticalCard },
    { id: 'birthday', title: 'كارت عيد الميلاد', description: 'تهنئة بعيد الميلاد', icon: Cake, Component: BirthdayCard },
    { id: 'motivation', title: 'البوستر التحفيزي', description: 'جملة تحفيزية', icon: Target, Component: MotivationPosterCard },
  ];

  const achievementCards = achievements.filter((a) => a.type === 'achievement');
  const hasAnyAchievements = certificates.length > 0 || achievements.length > 0;

  const handleDownload = async (cardId: string) => {
    const cardEl = cardRefs.current[cardId];
    if (!cardEl) return;

    setDownloadingId(cardId);
    try {
      const canvas = await html2canvas(cardEl, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `zein-note-${cardId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // pass
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShare = async (cardId: string) => {
    const cardEl = cardRefs.current[cardId];
    if (!cardEl) return;

    setDownloadingId(cardId);
    try {
      const canvas = await html2canvas(cardEl, { scale: 2, useCORS: true, backgroundColor: null });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `zein-note-${cardId}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'كروتي - زين نوت' });
        } else {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
        setDownloadingId(null);
      }, 'image/png');
    } catch {
      setDownloadingId(null);
    }
  };

  const renderCardWrapper = (
    cardId: string,
    title: string,
    description: string,
    icon: typeof IdCard,
    children: React.ReactNode
  ) => (
    <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all duration-300 hover:border-zen-gold/20">
      <div className="mb-4 flex w-full items-center justify-center gap-2 text-center">
        {(() => {
          const Icon = icon;
          return <Icon className="h-4 w-4 text-zen-gold" />;
        })()}
        <div>
          <h3 className="font-cairo text-base font-bold text-white">{title}</h3>
          <p className="font-tajawal text-xs text-white/50">{description}</p>
        </div>
      </div>

      <div className="flex justify-center overflow-hidden rounded-xl">
        <div
          ref={(el: HTMLDivElement | null) => {
            cardRefs.current[cardId] = el;
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-4 flex w-full gap-3">
        <button
          onClick={() => handleDownload(cardId)}
          disabled={downloadingId === cardId}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zen-gold py-2.5 font-cairo text-sm font-bold text-zen-bg transition-all duration-300 hover:bg-amber-500 disabled:opacity-50"
        >
          {downloadingId === cardId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          تحميل
        </button>
        <button
          onClick={() => handleShare(cardId)}
          disabled={downloadingId === cardId}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zen-blue/30 bg-zen-blue/10 py-2.5 font-cairo text-sm font-bold text-zen-blue transition-all duration-300 hover:bg-zen-blue hover:text-white disabled:opacity-50"
        >
          <Share2 className="h-4 w-4" />
          مشاركة
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zen-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-tajawal text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </button>

        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-right">
          <BrandLogo imageClassName="h-20 w-20 rounded-2xl shadow-xl shadow-zen-gold/20" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-zen-gold to-amber-600 shadow-lg shadow-zen-gold/30">
              <Layers className="h-6 w-6 text-white" />
            </div>
          <div>
            <h1 className="font-cairo text-2xl font-black text-white sm:text-3xl">كروتي</h1>
            <p className="font-tajawal text-sm text-white/60">كروت مميزة بتصميمات مختلفة — حمّلها أو شاركها</p>
          </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
          <button
            onClick={() => setActiveTab('my-cards')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-cairo text-sm font-bold transition-all duration-300 ${
              activeTab === 'my-cards'
                ? 'bg-zen-gold text-zen-bg shadow-lg shadow-zen-gold/30'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            كروتي
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-cairo text-sm font-bold transition-all duration-300 ${
              activeTab === 'achievements'
                ? 'bg-zen-blue text-white shadow-lg shadow-zen-blue/30'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Award className="h-4 w-4" />
            إنجازاتي
          </button>
        </div>

        {/* My Cards tab */}
        {activeTab === 'my-cards' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myCards.map((card) => {
              const CardComponent = card.Component;
              return (
                <div key={card.id}>
                  {renderCardWrapper(card.id, card.title, card.description, card.icon, (
                    <CardComponent profile={liveProfile} userId={user.id} />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Achievements tab */}
        {activeTab === 'achievements' && (
          <div>
            {loadingAchievements ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-zen-blue" />
              </div>
            ) : !hasAnyAchievements ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <ScrollText className="h-8 w-8 text-white/30" />
                </div>
                <p className="font-cairo text-lg font-bold text-white/60">
                  لسه مفيش شهادات، استمر في التعلم وهتستحقها! 🎯
                </p>
                <p className="mt-2 font-tajawal text-sm text-white/40">
                  الإدارة تصدر الشهادات وكروت الإنجاز لما تتميز في دراستك
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Certificates section (from certificates table — 9 types) */}
                {certificates.length > 0 && (
                  <div>
                    <h2 className="mb-4 flex items-center gap-2 font-cairo text-lg font-bold text-amber-400">
                      <ScrollText className="h-5 w-5" />
                      شهاداتي
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {certificates.map((cert) => {
                        const style = certificateStyles[cert.certificate_type];
                        return renderCardWrapper(
                          `certificate-${cert.id}`,
                          cert.title || style?.label || 'شهادة',
                          style ? `${style.icon} ${style.label}` : new Date(cert.issue_date).toLocaleDateString('ar-EG'),
                          ScrollText,
                          <CertificateCard certificate={cert} />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Achievement cards section (from student_achievements table) */}
                {achievementCards.length > 0 && (
                  <div>
                    <h2 className="mb-4 flex items-center gap-2 font-cairo text-lg font-bold text-amber-400">
                      <Target className="h-5 w-5" />
                      كروت الإنجاز
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {achievementCards.map((ach) =>
                        renderCardWrapper(
                          `ach-${ach.id}`,
                          ach.title || 'إنجاز',
                          new Date(ach.issued_at).toLocaleDateString('ar-EG'),
                          Target,
                          <AchievementDataCard profile={liveProfile} achievement={ach} />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCardsPage;
