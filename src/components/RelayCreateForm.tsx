import { useState } from 'react';
import type { RelayState, RelayMessage } from '../types/relay';
import { createRelayMessage, addMyMessage, sanitizeRelayMessage } from '../services/relay';

interface RelayCreateFormProps {
  relayState: RelayState;
  onComplete: (messages: RelayMessage[]) => void;
  onBack: () => void;
}

const SUGGESTIONS = [
  '你不是一个人在战斗，一切都会好起来的。',
  '今天的不开心就到此为止，明天会更好。',
  '你已经做得很棒了，给自己一点肯定吧。',
  '深呼吸，放轻松，一切都会过去的。',
  '记得照顾好自己，你的感受很重要。',
  '每一个困难都是成长的机会，加油！'
];

type Step = 'intro' | 'write' | 'review' | 'share';

export default function RelayCreateForm({ relayState, onComplete, onBack }: RelayCreateFormProps) {
  const [step, setStep] = useState<Step>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>(['', '', '']);
  const [error, setError] = useState('');
  const [createdMessages, setCreatedMessages] = useState<RelayMessage[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTextChange = (text: string) => {
    setError('');
    const updated = [...messages];
    updated[currentIndex] = text;
    setMessages(updated);
  };

  const handleSuggestion = (text: string) => {
    setError('');
    const updated = [...messages];
    updated[currentIndex] = text;
    setMessages(updated);
  };

  const handleNextMessage = () => {
    const result = sanitizeRelayMessage(messages[currentIndex]);
    if (!result.safe) {
      setError(result.reason || '请修改消息内容');
      return;
    }
    if (currentIndex < 2) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to review
      setStep('review');
    }
  };

  const handleGenerate = () => {
    const newMessages: RelayMessage[] = [];
    const allCodes = [...relayState.createdCodes];
    for (const text of messages) {
      const msg = createRelayMessage(text, allCodes);
      newMessages.push(msg);
      allCodes.push(msg.shareCode);
    }
    setCreatedMessages(newMessages);
    setStep('share');
  };

  const handleCopyCode = async (code: string, index: number) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#relay=${code}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleShare = async (code: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#relay=${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '心晴岛 - 有人给你送来了温暖 💌',
          text: '我在心晴岛给你写了一封匿名鼓励信，快来看看吧！',
          url: shareUrl
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyCode(code, 0);
    }
  };

  const handleFinish = () => {
    let updated = relayState;
    for (const msg of createdMessages) {
      updated = addMyMessage(updated, msg);
    }
    onComplete(createdMessages);
  };

  // Intro step
  if (step === 'intro') {
    return (
      <div className="relay-create-page">
        <div className="relay-create-header">
          <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={onBack}>
            ← 返回
          </button>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>发起接力</h2>
          <div style={{ width: '60px' }} />
        </div>

        <div style={{ padding: '24px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💌</div>
          <h1 style={{ fontSize: '22px', marginBottom: '12px' }}>温暖接力</h1>
          <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, marginBottom: '20px' }}>
            写下 3 条匿名鼓励消息，它们将带着温暖传递给需要的人。
            每条消息会生成一个分享码，你可以分享给朋友。
          </p>
          <div style={{ background: 'var(--glass-strong)', borderRadius: '20px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 8px' }}>💡 温馨提示</p>
            <p style={{ fontSize: '13px', color: 'var(--ink-700)', margin: 0, lineHeight: 1.6 }}>
              • 所有消息都是匿名的，你会获得一个可爱的匿名昵称<br />
              • 请写友善、鼓励的话，不要包含敏感内容<br />
              • 分享码可以发给任何人，收到的人可以回应你
            </p>
          </div>
          <button className="primary-button" onClick={() => setStep('write')}>
            开始写消息 ✍️
          </button>
        </div>
      </div>
    );
  }

  // Write step
  if (step === 'write') {
    return (
      <div className="relay-create-page">
        <div className="relay-create-header">
          <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setStep('intro')}>
            ← 返回
          </button>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>写消息</h2>
          <div style={{ width: '60px' }} />
        </div>

        <div className="relay-step-indicator">
          {[0, 1, 2].map(i => (
            <div key={i} className={`relay-step-dot ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'done' : ''}`} />
          ))}
        </div>

        <div className="message-input-area">
          <p className="message-input-hint">
            💌 第 {currentIndex + 1}/3 条鼓励消息
          </p>
          <textarea
            className="relay-textarea"
            placeholder="写下一句你想对需要支持的人说的话..."
            value={messages[currentIndex]}
            onChange={e => handleTextChange(e.target.value)}
            maxLength={120}
            autoFocus
          />
          <div className="char-count">{messages[currentIndex].length}/120</div>

          {error && (
            <div style={{ color: 'var(--coral-300)', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <div className="relay-placeholder-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => handleSuggestion(s)}>
                {s.slice(0, 18)}...
              </button>
            ))}
          </div>

          <button
            className="primary-button"
            style={{ marginTop: '16px' }}
            onClick={handleNextMessage}
          >
            {currentIndex < 2 ? '下一条 →' : '查看消息 →'}
          </button>
        </div>
      </div>
    );
  }

  // Review step
  if (step === 'review') {
    return (
      <div className="relay-create-page">
        <div className="relay-create-header">
          <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => setStep('write')}>
            ← 修改
          </button>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>确认消息</h2>
          <div style={{ width: '60px' }} />
        </div>

        <div className="review-messages">
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '16px' }}>
            这是你的 3 条匿名鼓励消息，确认后将生成分享码
          </p>
          {messages.map((text, i) => (
            <div key={i} className="review-card">
              <div className="review-card-number">{i + 1}</div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--ink-700)', margin: 0 }}>{text}</p>
            </div>
          ))}
          <button className="primary-button" onClick={handleGenerate}>
            ✨ 生成分享码
          </button>
        </div>
      </div>
    );
  }

  // Share step
  return (
    <div className="relay-create-page">
      <div className="relay-create-header">
        <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => setStep('review')}>
          ← 修改
        </button>
        <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>分享接力</h2>
        <div style={{ width: '60px' }} />
      </div>

      <div className="share-messages">
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '16px' }}>
          🎉 分享码已生成！每条消息都可以单独分享
        </p>
        {createdMessages.map((msg, i) => (
          <div key={msg.id} className="share-card">
            <div className="review-card-number" style={{ position: 'static', display: 'inline-flex', marginBottom: '8px' }}>
              {i + 1}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-700)', marginBottom: '10px' }}>"{msg.text}"</p>
            <div className="share-code-display">{msg.shareCode}</div>
            <div className="share-actions-row">
              <button
                className={`share-action-btn ${copiedIndex === i ? 'copied' : ''}`}
                onClick={() => handleCopyCode(msg.shareCode, i)}
              >
                {copiedIndex === i ? '✓ 已复制' : '📋 复制链接'}
              </button>
              <button className="share-action-btn" onClick={() => handleShare(msg.shareCode)}>
                📤 分享
              </button>
            </div>
          </div>
        ))}
        <button className="primary-button" onClick={handleFinish}>
          完成，回到接力中心
        </button>
      </div>
    </div>
  );
}
