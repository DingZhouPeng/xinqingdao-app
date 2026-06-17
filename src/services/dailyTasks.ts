import type { DailyTask, DailyTasksState } from '../types/dailyTasks';
import { DEFAULT_DAILY_TASKS } from '../types/dailyTasks';

const DAILY_TASKS_KEY = 'xinqingdao-daily-tasks-v1';

export function loadDailyTasks(): DailyTasksState {
  try {
    const raw = localStorage.getItem(DAILY_TASKS_KEY);
    if (!raw) return initializeDailyTasks();

    const saved = JSON.parse(raw) as DailyTasksState;
    const today = new Date().toDateString();

    // 如果日期变了，重置任务
    if (saved.lastRefreshDate !== today) {
      return initializeDailyTasks();
    }

    return saved;
  } catch {
    return initializeDailyTasks();
  }
}

function initializeDailyTasks(): DailyTasksState {
  return {
    tasks: DEFAULT_DAILY_TASKS.map(task => ({ ...task, completed: false })),
    lastRefreshDate: new Date().toDateString(),
    allCompleted: false
  };
}

export function saveDailyTasks(state: DailyTasksState): void {
  localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(state));
}

export function completeTask(state: DailyTasksState, taskId: string): DailyTasksState {
  const tasks = state.tasks.map(task =>
    task.id === taskId ? { ...task, completed: true } : task
  );

  const allCompleted = tasks.every(t => t.completed);

  return {
    ...state,
    tasks,
    allCompleted
  };
}

export function getTaskProgress(state: DailyTasksState): { completed: number; total: number } {
  const completed = state.tasks.filter(t => t.completed).length;
  const total = state.tasks.length;
  return { completed, total };
}

export function getTotalRewards(state: DailyTasksState): number {
  const taskRewards = state.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.reward, 0);
  const bonusReward = state.allCompleted ? 20 : 0;
  return taskRewards + bonusReward;
}
