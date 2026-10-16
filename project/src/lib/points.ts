import { supabase } from '@/lib/supabase';

export type PointAction =
  | 'lesson_complete'
  | 'quiz_complete'
  | 'quiz_high_score'
  | 'contest_win'
  | 'friend_invite'
  | 'daily_login'
  | 'ai_teacher_use';

export type LevelInfo = {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
};

export const pointValues: Record<PointAction, number> = {
  lesson_complete: 10,
  quiz_complete: 20,
  quiz_high_score: 50,
  contest_win: 100,
  friend_invite: 50,
  daily_login: 5,
  ai_teacher_use: 2,
};

export const actionLabels: Record<PointAction, string> = {
  lesson_complete: 'إكمال درس',
  quiz_complete: 'إكمال اختبار',
  quiz_high_score: 'اجتياز اختبار بنسبة 90%+',
  contest_win: 'الفوز بمسابقة',
  friend_invite: 'دعوة صديق',
  daily_login: 'تسجيل دخول يومي',
  ai_teacher_use: 'استخدام المدرس الذكي',
};

export const levels: LevelInfo[] = [
  { level: 1, name: 'مبتدئ', minPoints: 0, maxPoints: 99, color: 'from-slate-400 to-slate-500' },
  { level: 2, name: 'متقدم', minPoints: 100, maxPoints: 249, color: 'from-green-400 to-emerald-500' },
  { level: 3, name: 'محترف', minPoints: 250, maxPoints: 499, color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'خبير', minPoints: 500, maxPoints: 999, color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'بطل', minPoints: 1000, maxPoints: 1999, color: 'from-amber-400 to-orange-500' },
  { level: 6, name: 'أسطورة', minPoints: 2000, maxPoints: Infinity, color: 'from-rose-400 to-pink-600' },
];

export function getLevelInfo(totalPoints: number): LevelInfo {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].minPoints) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getNextLevel(currentLevel: number): LevelInfo | null {
  const next = levels.find((l) => l.level === currentLevel + 1);
  return next || null;
}

export function getProgressPercent(totalPoints: number): number {
  const current = getLevelInfo(totalPoints);
  if (current.level === 6) return 100;
  const next = getNextLevel(current.level);
  if (!next) return 100;
  const range = current.maxPoints - current.minPoints;
  const progress = totalPoints - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function getPointsToNextLevel(totalPoints: number): number {
  const current = getLevelInfo(totalPoints);
  if (current.level === 6) return 0;
  return current.maxPoints + 1 - totalPoints;
}

export type PointEntry = {
  id: string;
  points: number;
  action: string;
  description: string;
  created_at: string;
};

export async function addPoints(
  userId: string,
  action: PointAction,
  customDescription?: string
): Promise<{ success: boolean; newTotal: number | null }> {
  const points = pointValues[action];
  const description = customDescription || actionLabels[action];

  const { error: insertError } = await supabase.from('student_points').insert({
    user_id: userId,
    points,
    action,
    description,
  });

  if (insertError) {
    return { success: false, newTotal: null };
  }

  const { data: sumData, error: sumError } = await supabase
    .from('student_points')
    .select('points')
    .eq('user_id', userId);

  if (sumError || !sumData) {
    return { success: false, newTotal: null };
  }

  const newTotal = sumData.reduce((sum, entry) => sum + entry.points, 0);
  const newLevel = getLevelInfo(newTotal).level;

  await supabase
    .from('profiles')
    .update({ points: newTotal, level: newLevel, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { success: true, newTotal };
}

export async function getTotalPoints(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('student_points')
    .select('points')
    .eq('user_id', userId);

  if (error || !data) return 0;
  return data.reduce((sum, entry) => sum + entry.points, 0);
}

export async function getPointsHistory(userId: string): Promise<PointEntry[]> {
  const { data, error } = await supabase
    .from('student_points')
    .select('id, points, action, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as PointEntry[];
}
