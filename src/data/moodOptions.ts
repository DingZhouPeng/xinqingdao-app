import type { MoodType, SceneTag } from '../types';

export const moodOptions: Array<{ id: MoodType; label: string; weather: string; emoji: string; hint: string }> = [
  { id: 'happy', label: '开心', weather: '晴天', emoji: '☀️', hint: '有阳光，也可以记录下来' },
  { id: 'calm', label: '平静', weather: '晴间多云', emoji: '🌤️', hint: '稳定也是一种力量' },
  { id: 'nervous', label: '紧张', weather: '大风', emoji: '🌪️', hint: '先让身体慢下来' },
  { id: 'angry', label: '生气', weather: '雷阵雨', emoji: '⛈️', hint: '先暂停，不急着回复' },
  { id: 'sad', label: '难过', weather: '小雨', emoji: '🌧️', hint: '谢谢你愿意说出来' },
  { id: 'tired', label: '疲惫', weather: '多云', emoji: '☁️', hint: '也许你需要一点补给' },
  { id: 'confused', label: '迷茫', weather: '雾天', emoji: '🌫️', hint: '我们先看清下一小步' },
  { id: 'stressed', label: '烦躁', weather: '阴天', emoji: '🌥️', hint: '把大问题拆小一点' }
];

export const sceneOptions: Array<{ id: SceneTag; label: string; emoji: string }> = [
  { id: 'study', label: '学习考试', emoji: '📚' },
  { id: 'friends', label: '同伴关系', emoji: '🤝' },
  { id: 'family', label: '家庭沟通', emoji: '🏠' },
  { id: 'self', label: '自我评价', emoji: '🪞' },
  { id: 'body', label: '身体疲惫', emoji: '🛌' },
  { id: 'unknown', label: '说不清', emoji: '🫧' }
];

export function moodWeatherLabel(mood: MoodType): string {
  return moodOptions.find((item) => item.id === mood)?.weather ?? '多云';
}

export function moodEmoji(mood: MoodType): string {
  return moodOptions.find((item) => item.id === mood)?.emoji ?? '🌤️';
}
