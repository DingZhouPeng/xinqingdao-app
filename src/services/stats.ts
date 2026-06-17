import type { EmotionRecord } from '../types';
import { moodWeatherLabel } from '../data/moodOptions';

export function getAverageChange(records: EmotionRecord[]): string {
  if (records.length === 0) return '暂无记录';
  const before = records.reduce((sum, record) => sum + record.input.intensity, 0) / records.length;
  const after = records.reduce((sum, record) => sum + record.intensityAfter, 0) / records.length;
  return `${before.toFixed(1)} → ${after.toFixed(1)}`;
}

export function getMostCommonWeather(records: EmotionRecord[]): string {
  if (records.length === 0) return '还没有天气';
  const counts = new Map<string, number>();
  for (const record of records) {
    const label = moodWeatherLabel(record.input.mood);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
}

export function getBestRelief(records: EmotionRecord[]): string {
  if (records.length === 0) return '等待解锁';
  const counts = new Map<string, number>();
  for (const record of records) {
    const first = record.recommendation.tasks[0]?.title ?? record.recommendation.firstAid;
    counts.set(first, (counts.get(first) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
}
