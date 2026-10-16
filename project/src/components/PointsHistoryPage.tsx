import { useEffect, useState } from 'react';
import { ArrowRight, Star, Award, History, Loader2, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/BrandLogo';
import {
  getPointsHistory,
  getLevelInfo,
  getPointsToNextLevel,
  getProgressPercent,
  type PointEntry,
} from '@/lib/points';

type PointsHistoryPageProps = {
  onBack: () => void;
};

function PointsHistoryPage({ onBack }: PointsHistoryPageProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PointEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getPointsHistory(user.id).then((data) => {
      setEntries(data);
      setTotalPoints(data.reduce((sum, e) => sum + e.points, 0));
      setLoading(false);
    });
  }, [user]);

  if (!user) return null;

  const levelInfo = getLevelInfo(totalPoints);
  const pointsToNext = getPointsToNextLevel(totalPoints);
  const progressPercent = getProgressPercent(totalPoints);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-zen-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-tajawal text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </button>

        {/* Summary card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="flex justify-center border-b border-white/10 px-6 py-4">
            <BrandLogo imageClassName="h-16 w-16 rounded-xl shadow-lg shadow-zen-gold/20" showName nameClassName="text-xl text-white" />
          </div>
          <div className="relative h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-10 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-zen-bg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg">
                <Coins className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="mt-4 text-center font-cairo text-2xl font-black text-white">نقاطي</h1>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-center">
                <Star className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                <div className="font-cairo text-3xl font-black text-amber-400">{totalPoints}</div>
                <div className="mt-1 font-tajawal text-xs text-white/60">إجمالي النقاط</div>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-center">
                <Award className="mx-auto mb-2 h-6 w-6 text-blue-400" />
                <div className="font-cairo text-3xl font-black text-blue-400">{levelInfo.level}</div>
                <div className="mt-1 font-tajawal text-xs text-white/60">{levelInfo.name}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-tajawal text-xs text-white/60">التقدم نحو المستوى التالي</span>
                <span className="font-tajawal text-xs text-white/60">
                  {levelInfo.level === 6 ? 'الحد الأقصى' : `باقي ${pointsToNext} نقطة`}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-l ${levelInfo.color} transition-all duration-700`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-white/60" />
            <h2 className="font-cairo text-lg font-bold text-white">سجل النقاط</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zen-blue" />
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="font-tajawal text-sm text-white/50">
                لا توجد نقاط بعد. ابدأ التعلم لكسب النقاط!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-amber-400/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                    <Star className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-tajawal text-sm font-medium text-white">
                      {entry.description}
                    </p>
                    <p className="font-tajawal text-xs text-white/40">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <div className="shrink-0 font-cairo text-sm font-bold text-amber-400">
                    +{entry.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PointsHistoryPage;
