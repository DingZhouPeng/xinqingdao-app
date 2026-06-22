import type { Achievement, AchievementsState } from '../types/achievements';
import { DEFAULT_ACHIEVEMENTS } from '../types/achievements';
import type { AppStateSnapshot, GameProgress } from '../types';

const ACHIEVEMENTS_KEY = 'xinqingdao-achievements-v1';
const STATS_KEY = 'xinqingdao-stats-v1';

export interface UserStats {
  records: number;
  breathBestScore: number;
  bubblesPopped: number;
  petCareCount: number;
  loginStreak: number;
  lastLoginDate: string;
  relayStarted: number;
  relayMessagesWritten: number;
  relayResponses: number;
  relayTotalReach: number;
  relayMaxChainReach: number;
  postcardsShared: number;
}

export function loadAchievements(): AchievementsState {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return initializeAchievements();
    return JSON.parse(raw) as AchievementsState;
  } catch {
    return initializeAchievements();
  }
}

function initializeAchievements(): AchievementsState {
  return {
    achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })),
    totalUnlocked: 0
  };
}

export function saveAchievements(state: AchievementsState): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state));
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return initializeStats();
    return JSON.parse(raw) as UserStats;
  } catch {
    return initializeStats();
  }
}

function initializeStats(): UserStats {
  return {
    records: 0,
    breathBestScore: 0,
    bubblesPopped: 0,
    petCareCount: 0,
    loginStreak: 0,
    lastLoginDate: '',
    relayStarted: 0,
    relayMessagesWritten: 0,
    relayResponses: 0,
    relayTotalReach: 0,
    relayMaxChainReach: 0,
    postcardsShared: 0
  };
}

export function saveStats(stats: UserStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// 检查并解锁成就
export function checkAchievements(
  state: AchievementsState,
  stats: UserStats,
  snapshot: AppStateSnapshot,
  gameProgress: GameProgress
): { state: AchievementsState; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = state.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let shouldUnlock = false;

    switch (achievement.condition) {
      case 'records >= 1':
        shouldUnlock = stats.records >= 1;
        break;
      case 'records >= 10':
        shouldUnlock = stats.records >= 10;
        break;
      case 'breathScore >= 100':
        shouldUnlock = stats.breathBestScore >= 100;
        break;
      case 'bubblesPopped >= 100':
        shouldUnlock = stats.bubblesPopped >= 100;
        break;
      case 'petCareCount >= 20':
        shouldUnlock = stats.petCareCount >= 20;
        break;
      case 'totalCoinsEarned >= 500':
        shouldUnlock = gameProgress.currency.totalEarned >= 500;
        break;
      case 'allOutfitsUnlocked':
        shouldUnlock = gameProgress.unlockedOutfits.length >= 8; // 总共8个装扮
        break;
      case 'loginStreak >= 7':
        shouldUnlock = stats.loginStreak >= 7;
        break;
      case 'allDailyTasksComplete':
        // 这个由外部传入标记
        shouldUnlock = false;
        break;
      case 'petHappiness >= 100':
        shouldUnlock = gameProgress.petState.happiness >= 100;
        break;
      case 'relayStarted >= 1':
        shouldUnlock = stats.relayStarted >= 1;
        break;
      case 'relayMessagesWritten >= 10':
        shouldUnlock = stats.relayMessagesWritten >= 10;
        break;
      case 'relayResponses >= 5':
        shouldUnlock = stats.relayResponses >= 5;
        break;
      case 'relayTotalReach >= 10':
        shouldUnlock = stats.relayTotalReach >= 10;
        break;
      case 'relayMaxChainReach >= 5':
        shouldUnlock = stats.relayMaxChainReach >= 5;
        break;
      case 'postcardsShared >= 3':
        shouldUnlock = stats.postcardsShared >= 3;
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      });
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
    }

    return achievement;
  });

  return {
    state: {
      achievements: updatedAchievements,
      totalUnlocked: updatedAchievements.filter(a => a.unlocked).length
    },
    newlyUnlocked
  };
}

// 更新登录连续天数
export function updateLoginStreak(stats: UserStats): UserStats {
  const today = new Date().toDateString();
  const lastLogin = stats.lastLoginDate;

  if (!lastLogin) {
    return {
      ...stats,
      loginStreak: 1,
      lastLoginDate: today
    };
  }

  const lastDate = new Date(lastLogin);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // 连续登录
    return {
      ...stats,
      loginStreak: stats.loginStreak + 1,
      lastLoginDate: today
    };
  } else if (diffDays > 1) {
    // 中断了，重新开始
    return {
      ...stats,
      loginStreak: 1,
      lastLoginDate: today
    };
  }

  // 今天已经登录过
  return stats;
}
