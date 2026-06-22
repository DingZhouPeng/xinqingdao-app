import { useState } from 'react';
import type { RelayState, RelayResponse } from '../types/relay';
import { findChainByCode, recordCodeRedemption, addResponse, generateAlias } from '../services/relay';

interface RelayCodeOverlayProps {
  code: string;
  relayState: RelayState;
  onDismiss: () => void;
  onRelayStateChange: (state: RelayState) => void;
  onEarnCoins: (amount: number, reason: string) => void;
  onStatsUpdate: (updates: Record<string, number>) => void;
}

export default function RelayCodeOverlay({
  code,
  relayState,
  onDismiss,
  onRelayStateChange,
  onEarnCoins,
  onStatsUpdate
}: RelayCodeOverlayProps) {
  const chain = findChainByCode(relayState, code);
  const alreadyRedeemed = relayState.redeemedCodes.includes(code);
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendResponse = () => {
    if (responseText.trim().length < 2) return;

    const response: RelayResponse = {
      id: `resp-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      relayMessageId: chain?.shareCode || code,
      text: responseText.trim().slice(0, 120),
      responderAlias: generateAlias(),
      createdAt: new Date().toISOString()
    };

    let updated = addResponse(relayState, response);
    updated = recordCodeRedemption(updated, code);
    onRelayStateChange(updated);
    onEarnCoins(15, '温暖回应');
    onStatsUpdate({
      relayResponses: 1,
      relayTotalReach: 1
    });
    setSent(true);
  };

  const handleContinueRelay = () => {
    onDismiss();
    // Navigate to create - handled by parent
  };

  // Cold user fallback — someone with a code who isn't in any chain
  if (!chain && !alreadyRedeemed) {
    return (
      <div className="relay-overlay" onClick={onDismiss}>
        <div className="relay-overlay-card" onClick={e => e.stopPropagation()}>
          <div className="relay-overlay-icon">💌</div>
          <h2>有人给你送来了温暖</h2>
          <p className="relay-overlay-message">
            一位匿名的朋友通过接力码 <strong>{code}</strong> 向你传递了一份鼓励。
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
            你可以先完成注册（如果你还没有），然后就能查看这条消息并继续传递温暖。
          </p>
          <div className="relay-overlay-actions">
            <button className="primary-button" onClick={onDismiss}>
              好的，开始吧
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Already redeemed
  if (alreadyRedeemed && !showResponse && !sent) {
    return (
      <div className="relay-overlay" onClick={onDismiss}>
        <div className="relay-overlay-card" onClick={e => e.stopPropagation()}>
          <div className="relay-overlay-icon">💌</div>
          <h2>你已经回应过这条接力</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
            这条温暖消息的接力码是 <strong>{code}</strong>
          </p>
          {chain && (
            <p style={{ color: 'var(--ink-700)', marginBottom: '16px' }}>
              🌟 这条消息已经传递给了 <strong>{chain.reachCount}</strong> 个人
            </p>
          )}
          <div className="relay-overlay-actions">
            <button className="primary-button" onClick={onDismiss}>
              知道了
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Has chain data — show message
  return (
    <div className="relay-overlay" onClick={onDismiss}>
      <div className="relay-overlay-card" onClick={e => e.stopPropagation()}>
        <div className="relay-overlay-icon">💌</div>
        <span className="relay-overlay-alias">{chain?.originalMessage.senderAlias || '匿名小伙伴'}</span>

        {!sent && (
          <>
            <div className="relay-overlay-message">
              {chain?.originalMessage.text || '送你一份温暖'}
            </div>

            {chain && chain.reachCount > 1 && (
              <div className="relay-overlay-stats">
                🌟 这条消息已经传递给了 <strong>{chain.reachCount}</strong> 个人
              </div>
            )}

            {!showResponse ? (
              <div className="relay-overlay-actions">
                <button className="ghost-button" onClick={onDismiss}>
                  关闭
                </button>
                <button className="primary-button" onClick={() => setShowResponse(true)}>
                  💌 送一个回应
                </button>
              </div>
            ) : (
              <div>
                <textarea
                  className="relay-response-input"
                  placeholder="写一句温暖的回应..."
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  maxLength={120}
                  autoFocus
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
                  {responseText.length}/120
                </div>
                <div className="relay-overlay-actions">
                  <button className="ghost-button" onClick={() => setShowResponse(false)}>
                    取消
                  </button>
                  <button
                    className="primary-button"
                    onClick={handleSendResponse}
                    disabled={responseText.trim().length < 2}
                  >
                    发送回应
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {sent && (
          <>
            <div className="relay-overlay-message">
              💌 你的温暖回应已经送出！<br />
              <small style={{ color: 'var(--muted)' }}>收到回应的人会感到被支持</small>
            </div>
            <div className="relay-overlay-actions">
              <button className="ghost-button" onClick={onDismiss}>
                关闭
              </button>
              <button className="primary-button" onClick={handleContinueRelay}>
                🔗 我也发起接力
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
