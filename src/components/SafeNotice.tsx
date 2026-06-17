interface SafeNoticeProps {
  variant?: 'normal' | 'strong';
}

export default function SafeNotice({ variant = 'normal' }: SafeNoticeProps) {
  return (
    <div className={`safe-notice ${variant === 'strong' ? 'is-strong' : ''}`}>
      <strong>安全说明</strong>
      <p>心晴岛用于情绪记录和心理成长练习，不进行心理疾病诊断，也不替代老师、家长、心理咨询或医疗服务。</p>
    </div>
  );
}
