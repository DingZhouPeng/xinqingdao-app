import type { DailyTasksState } from '../types/dailyTasks';

interface DailyTasksPageProps {
  dailyTasksState: DailyTasksState;
  onBack: () => void;
}

export default function DailyTasksPage({ dailyTasksState, onBack }: DailyTasksPageProps) {
  const { tasks, allCompleted } = dailyTasksState;
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="page daily-tasks-page">
      <header className="page-header">
        <button className="btn-back" onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1>每日任务</h1>
        <div style={{ width: '48px' }} />
      </header>

      {/* 进度条 */}
      <section className="tasks-progress glass-card fade-in-up">
        <div className="progress-header">
          <span className="progress-label">今日进度</span>
          <span className="progress-count">{completedCount} / {tasks.length}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        {allCompleted && (
          <div className="all-completed-badge fade-in-scale">
            <span className="badge-icon">🎉</span>
            <span className="badge-text">全部完成！额外奖励 +20 金币</span>
          </div>
        )}
      </section>

      {/* 任务列表 */}
      <section className="tasks-list">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`task-card glass-card fade-in-up delay-${index + 1} ${task.completed ? 'task-completed' : ''}`}
          >
            <div className="task-icon">{task.icon}</div>
            <div className="task-content">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
            </div>
            <div className="task-reward">
              {task.completed ? (
                <span className="task-check">✓</span>
              ) : (
                <>
                  <span className="reward-icon">💰</span>
                  <span className="reward-amount">+{task.reward}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 温馨提示 */}
      <section className="tasks-hint glass-card fade-in-up delay-4">
        <p>💡 完成任务会自动标记，明天会刷新新的任务哦！</p>
      </section>
    </div>
  );
}
