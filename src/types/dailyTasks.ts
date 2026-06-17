export interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  icon: string;
}

export interface DailyTasksState {
  tasks: DailyTask[];
  lastRefreshDate: string;
  allCompleted: boolean;
}

export const DEFAULT_DAILY_TASKS: Omit<DailyTask, 'completed'>[] = [
  {
    id: 'record-mood',
    title: '记录心情',
    description: '记录一次你的心情',
    reward: 10,
    icon: '🌤️'
  },
  {
    id: 'play-bubble-game',
    title: '玩消消乐',
    description: '在消消乐中得分 > 30',
    reward: 15,
    icon: '🫧'
  },
  {
    id: 'feed-pet',
    title: '照顾晴晴',
    description: '喂食或玩耍 3 次',
    reward: 5,
    icon: '🐾'
  }
];
