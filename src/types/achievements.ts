export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string; // 用于判断的条件
  reward: number; // 金币奖励
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementsState {
  achievements: Achievement[];
  totalUnlocked: number;
}

export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-record',
    title: '初次记录',
    description: '记录你的第一次心情',
    icon: '🌟',
    condition: 'records >= 1',
    reward: 10
  },
  {
    id: 'record-master',
    title: '情绪大师',
    description: '累计记录 10 次心情',
    icon: '🏆',
    condition: 'records >= 10',
    reward: 50
  },
  {
    id: 'perfect-breath',
    title: '呼吸大师',
    description: '呼吸游戏得分超过 100',
    icon: '🎯',
    condition: 'breathScore >= 100',
    reward: 30
  },
  {
    id: 'bubble-pro',
    title: '消除达人',
    description: '消消乐累计消除 100 个气泡',
    icon: '💫',
    condition: 'bubblesPopped >= 100',
    reward: 30
  },
  {
    id: 'pet-lover',
    title: '晴晴的好朋友',
    description: '照顾晴晴 20 次',
    icon: '💝',
    condition: 'petCareCount >= 20',
    reward: 50
  },
  {
    id: 'coin-collector',
    title: '金币收藏家',
    description: '累计获得 500 金币',
    icon: '💰',
    condition: 'totalCoinsEarned >= 500',
    reward: 100
  },
  {
    id: 'outfit-collector',
    title: '装扮收藏家',
    description: '解锁所有装扮',
    icon: '👗',
    condition: 'allOutfitsUnlocked',
    reward: 100
  },
  {
    id: 'week-streak',
    title: '坚持不懈',
    description: '连续 7 天登录',
    icon: '🔥',
    condition: 'loginStreak >= 7',
    reward: 80
  },
  {
    id: 'all-tasks-complete',
    title: '任务专家',
    description: '完成一次全部每日任务',
    icon: '✨',
    condition: 'allDailyTasksComplete',
    reward: 20
  },
  {
    id: 'happy-pet',
    title: '快乐的晴晴',
    description: '让晴晴的快乐度达到 100',
    icon: '😊',
    condition: 'petHappiness >= 100',
    reward: 30
  },
  {
    id: 'relay-starter',
    title: '温暖发起者',
    description: '发起第一次温暖接力',
    icon: '🕊️',
    condition: 'relayStarted >= 1',
    reward: 30
  },
  {
    id: 'relay-writer',
    title: '温暖书写者',
    description: '写下 10 条鼓励消息',
    icon: '✍️',
    condition: 'relayMessagesWritten >= 10',
    reward: 50
  },
  {
    id: 'relay-responder',
    title: '温暖回应者',
    description: '回应 5 条接力消息',
    icon: '💌',
    condition: 'relayResponses >= 5',
    reward: 40
  },
  {
    id: 'warm-ambassador',
    title: '温暖大使',
    description: '你的温暖传递给了 10 个人',
    icon: '🌟',
    condition: 'relayTotalReach >= 10',
    reward: 100
  },
  {
    id: 'relay-chain-5',
    title: '接力达人',
    description: '一条接力链达到 5 人',
    icon: '🔗',
    condition: 'relayMaxChainReach >= 5',
    reward: 60
  },
  {
    id: 'postcard-sharer',
    title: '明信片使者',
    description: '分享 3 张心情明信片',
    icon: '🖼️',
    condition: 'postcardsShared >= 3',
    reward: 30
  },
  {
    id: 'evo-stage-3',
    title: '花苞初绽',
    description: '晴晴进化到第 3 阶段',
    icon: '🌸',
    condition: 'evolutionStage >= 3',
    reward: 80
  },
  {
    id: 'evo-stage-5',
    title: '守护者降临',
    description: '晴晴进化到最高阶段',
    icon: '👑',
    condition: 'evolutionStage >= 5',
    reward: 200
  },
  {
    id: 'evo-legendary',
    title: '传说之宠',
    description: '获得一个传说级突变',
    icon: '🌈',
    condition: 'hasLegendaryTrait',
    reward: 150
  },
  {
    id: 'fusion-master',
    title: '共鸣大师',
    description: '完成 3 次合体进化',
    icon: '💫',
    condition: 'fusionCount >= 3',
    reward: 120
  }
];
