import type { RelayChain } from '../types/relay';

interface RelayChainViewProps {
  chain: RelayChain;
  onBack: () => void;
  onContinueRelay: () => void;
}

export default function RelayChainView({ chain, onBack, onContinueRelay }: RelayChainViewProps) {
  return (
    <div className="relay-create-page">
      <div className="relay-create-header">
        <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={onBack}>
          ← 返回
        </button>
        <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>接力链</h2>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ textAlign: 'center', padding: '14px 18px 0' }}>
        <div className="share-code-display" style={{ fontSize: '24px', margin: '0 0 8px' }}>
          {chain.shareCode}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          🌟 这串温暖已经传递给了 <strong>{chain.reachCount}</strong> 个人
        </p>
      </div>

      <div className="chain-tree">
        {/* Origin node */}
        <div className="chain-origin">
          <div className="chain-node">
            <div className="chain-node-header">
              <span className="relay-alias">{chain.originalMessage.senderAlias}</span>
              <span className="relay-date">
                {new Date(chain.originalMessage.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-700)', margin: 0 }}>
              "{chain.originalMessage.text}"
            </p>
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>🌱 起点</small>
            </div>
          </div>
        </div>

        {/* Response nodes */}
        {chain.responses.length > 0 ? (
          <div className="chain-responses">
            {chain.responses.map((resp) => (
              <div key={resp.id} className="chain-node">
                <div className="chain-node-header">
                  <span className="relay-alias">{resp.responderAlias}</span>
                  <span className="relay-date">
                    {new Date(resp.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-700)', margin: 0 }}>
                  "{resp.text}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="chain-empty">
            <span className="chain-empty-emoji">📭</span>
            <p>还没有人回应这条接力</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>分享接力码让更多人看到</p>
          </div>
        )}

        <button className="primary-button continue-relay-btn" onClick={onContinueRelay}>
          🔗 继续接力
        </button>
      </div>
    </div>
  );
}
