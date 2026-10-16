import { useEffect, useState } from 'react';
import { Star, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelInfo, getPointsToNextLevel, getProgressPercent, getTotalPoints } from '@/lib/points';

function PointsBar() {
  const { user, profile } = useAuth();
  const [totalPoints, setTotalPoints] = useState<number>(profile?.points ?? 0);

  useEffect(() => {
    if (!user) return;
    getTotalPoints(user.id).then((pts) => setTotalPoints(pts));
  }, [user]);

  if (!user) return null;

  const levelInfo = getLevelInfo(totalPoints);
  const pointsToNext = getPointsToNextLevel(totalPoints);
  const progressPercent = getProgressPercent(totalPoints);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Level badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-cairo text-sm font-bold text-blue-400">المستوى {levelInfo.level}</p>
              <p className="font-tajawal text-xs text-white/60">{levelInfo.name}</p>
            </div>
          </div>

          {/* Points display */}
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="font-cairo text-sm font-bold text-amber-400">النقاط</p>
              <p className="font-cairo text-xl font-black text-amber-400">{totalPoints}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-tajawal text-xs text-white/60">
              التقدم نحو المستوى التالي
            </span>
            <span className="font-tajawal text-xs text-white/60">
              {levelInfo.level === 6 ? 'الحد الأقصى' : `باقي ${pointsToNext} نقطة`}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-l ${levelInfo.color} transition-all duration-700 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-white/40" />
            <span className="font-tajawal text-xs text-white/40">
              {levelInfo.minPoints} - {levelInfo.level === 6 ? '∞' : levelInfo.maxPoints} نقطة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointsBar;
