import { useState } from 'react';
import type { ActiveView, AppStateSnapshot, GameProgress } from '../types';
import type { RelayState, RelayMessage, RelayChain } from '../types/relay';
import { getMyRelayStats, findChainByCode } from '../services/relay';
import RelayCreateForm from '../components/RelayCreateForm';
import RelayChainView from '../components/RelayChainView';
import MoodPostcard from '../components/MoodPostcard';
import SpriteSnapshotCard from '../components/SpriteSnapshotCard';
import { moodEmoji } from '../data/moodOptions';

type SocialSubView = 'hub' | 'create' | 'chain' | 'postcard' | 'snapshot';

interface SocialPageProps {
  relayState: RelayState;
  snapshot: AppStateSnapshot;
  gameProgress: GameProgress;
  onRelayStateChange: (state: RelayState) => void;
  onNavigate: (view: ActiveView) => void;
  onEarnCoins: (amount: number, reason: string) => void;
  onGrantXp: (amount: number) => void;
  onStatsUpdate: (updates: Record<string, number>) => void;
}

export default function SocialPage({
  relayState,
  snapshot,
  gameProgress,
  onRelayStateChange,
  onNavigate,
  onEarnCoins,
  onGrantXp,
  onStatsUpdate
}: SocialPageProps) {
  const [subView, setSubView] = useState<SocialSubView>('hub');
  const [selectedChain, setSelectedChain] = useState<RelayChain | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // Local relay state for immediate UI updates
  const [localRelayState, setLocalRelayState] = useState<RelayState>(relayState);

  // Sync from prop when it changes
  const displayRelayState = localRelayState.myMessages.length > 0 ? localRelayState : relayState;

  const stats = getMyRelayStats(displayRelayState);
  const latest = snapshot.records[0];

  const handleCreateComplete = (messages: RelayMessage[], updatedRelayState: RelayState) => {
    const count = messages.length;
    setLocalRelayState(updatedRelayState);
    onRelayStateChange(updatedRelayState);
    onEarnCoins(count * 20, `发起温暖接力 x${count}`);
    onGrantXp(count * 20); // 每条消息 20 XP
    onStatsUpdate({
      relayStarted: 1,
      relayMessagesWritten: count,
      relayTotalReach: count
    });
    setSubView('hub');
  };

  const handleViewChain = (code: string) => {
    const chain = findChainByCode(displayRelayState, code);
    if (chain) {
      setSelectedChain(chain);
      setSubView('chain');
    }
  };

  const handleContinueRelay = () => {
    setSubView('create');
  };

  const handlePostcardShared = () => {
    onStatsUpdate({ postcardsShared: 1 });
  };

  const copyShareCode = async (code: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#relay=${code}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Sub-view routing
  if (subView === 'create') {
    return (
      <RelayCreateForm
        relayState={displayRelayState}
        onComplete={handleCreateComplete}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'chain' && selectedChain) {
    return (
      <RelayChainView
        chain={selectedChain}
        onBack={() => setSubView('hub')}
        onContinueRelay={handleContinueRelay}
      />
    );
  }

  if (subView === 'postcard' && latest) {
    return (
      <MoodPostcard
        mood={latest.input.mood}
        moodEmoji={moodEmoji(latest.input.mood)}
        intensity={latest.input.intensity}
        sunlight={snapshot.sunlight}
        waterDrops={snapshot.waterDrops}
        lamps={snapshot.lamps}
        onBack={() => setSubView('hub')}
        onShared={handlePostcardShared}
      />
    );
  }

  if (subView === 'postcard' && !latest) {
    return (
      <div className="relay-create-page">
        <div className="relay-create-header">
          <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => setSubView('hub')}>
            ← 返回
          </button>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>心情明信片</h2>
          <div style={{ width: '60px' }} />
        </div>
        <div className="chain-empty" style={{ padding: '60px 20px' }}>
          <span className="chain-empty-emoji">📸</span>
          <p>还没有心情记录</p>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>先记录一次心情，就能生成明信片啦</p>
          <button className="primary-button" onClick={() => onNavigate('mood')} style={{ marginTop: '16px' }}>
            🌤️ 去记录心情
          </button>
        </div>
      </div>
    );
  }

  // Sprint snapshot card
  if (subView === 'snapshot' && gameProgress.petState.evolution) {
    return (
      <SpriteSnapshotCard
        evolution={gameProgress.petState.evolution}
        relayCode={relayState.myMessages[0]?.shareCode}
        onClose={() => setSubView('hub')}
        onShared={() => onStatsUpdate({ postcardsShared: 1 })}
      />
    );
  }

  // Hub view
  return (
    <div className="relay-hub">
      {/* Header */}
      <div className="relay-header">
        <p className="eyebrow">温暖接力</p>
        <h1>弱社交，强支持</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          用匿名的方式传递温暖，让支持流动起来
        </p>
      </div>

      {/* Impact Stats */}
      {stats.totalMessages > 0 ? (
        <div className="relay-impact-card">
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--coral-300)' }}>
            🌟 你的温暖影响力
          </span>
          <div className="relay-impact-stats">
            <div className="relay-impact-stat">
              <span className="stat-number">{stats.totalReach}</span>
              <span className="stat-label">触达人数</span>
            </div>
            <div className="relay-impact-stat">
              <span className="stat-number">{stats.totalMessages}</span>
              <span className="stat-label">发送消息</span>
            </div>
            <div className="relay-impact-stat">
              <span className="stat-number">{stats.totalResponses}</span>
              <span className="stat-label">收到回应</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relay-impact-card" style={{ opacity: 0.8 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--muted)' }}>
            🕊️ 还没有发起过接力
          </span>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
            写下 3 条鼓励消息，开始你的第一次温暖接力
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="relay-actions" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <button className="relay-action-btn primary-action" onClick={() => setSubView('create')}>
          <span className="action-emoji">💌</span>
          <span className="action-label">发起接力</span>
          <span className="action-sub">+60 金币</span>
        </button>
        <button className="relay-action-btn" onClick={() => setSubView('postcard')}>
          <span className="action-emoji">🖼️</span>
          <span className="action-label">明信片</span>
          <span className="action-sub">分享心情</span>
        </button>
        <button className="relay-action-btn primary-action" onClick={() => setSubView('snapshot')}>
          <span className="action-emoji">📸</span>
          <span className="action-label">精灵快照</span>
          <span className="action-sub">晒进化精灵</span>
        </button>
      </div>

      {/* My Messages */}
      {displayRelayState.myMessages.length > 0 && (
        <div className="relay-section">
          <h3 className="relay-section-title">
            💌 我的接力消息
          </h3>
          {displayRelayState.myMessages.map(msg => {
            const chain = findChainByCode(displayRelayState, msg.shareCode);
            return (
              <div
                key={msg.id}
                className="relay-message-card"
                onClick={() => handleViewChain(msg.shareCode)}
              >
                <div className="relay-msg-header">
                  <span className="relay-alias">{msg.senderAlias}</span>
                  <span className="relay-date">
                    {new Date(msg.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="relay-msg-text">"{msg.text}"</p>
                <div className="relay-msg-footer">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="relay-code-badge">{msg.shareCode}</span>
                    <button
                      className={`copy-code-btn ${copiedCode === msg.shareCode ? 'copied' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        copyShareCode(msg.shareCode);
                      }}
                    >
                      {copiedCode === msg.shareCode ? '✓ 已复制' : '📋 复制'}
                    </button>
                  </div>
                  <span className="relay-reach">
                    {chain ? `${chain.reachCount} 人收到` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Warm Tips */}
      <div className="relay-section">
        <div className="panel-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>💡 如何产生裂变？</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
            复制分享链接发给朋友 → 朋友打开看到你的鼓励 → 朋友回应并写自己的接力 →
            更多人加进来 → 温暖链条不断延伸！
          </p>
        </div>
      </div>
    </div>
  );
}
