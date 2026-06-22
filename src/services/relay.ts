import type { RelayState, RelayMessage, RelayResponse, RelayChain } from '../types/relay';

const RELAY_KEY = 'xinqingdao-relay-v1';

export const DEFAULT_RELAY_STATE: RelayState = {
  myMessages: [],
  myResponses: [],
  chainsIKnowAbout: [],
  totalReach: 0,
  totalRewardsEarned: 0,
  createdCodes: [],
  redeemedCodes: []
};

export function loadRelayState(): RelayState {
  try {
    const raw = localStorage.getItem(RELAY_KEY);
    if (!raw) return DEFAULT_RELAY_STATE;
    return { ...DEFAULT_RELAY_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RELAY_STATE;
  }
}

export function saveRelayState(state: RelayState): void {
  localStorage.setItem(RELAY_KEY, JSON.stringify(state));
}

// 生成 6 位唯一分享码
export function generateShareCode(existing: string[]): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let attempt = 0; attempt < 100; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (!existing.includes(code)) return code;
  }
  return 'WARM42'; // 极端情况兜底
}

// 生成匿名昵称
const ANIMAL_NAMES = ['小海豚', '小猫咪', '小企鹅', '小星星', '小月亮', '小太阳', '小花朵', '小叶子', '小溪流', '小贝壳', '小云朵', '小彩虹', '小蝴蝶', '小蜻蜓', '小雪人', '小松树'];
const WARM_ADJECTIVES = ['温暖的', '勇敢的', '善良的', '可爱的', '安静的', '闪亮的', '温柔的', '乐观的'];

export function generateAlias(): string {
  const adj = WARM_ADJECTIVES[Math.floor(Math.random() * WARM_ADJECTIVES.length)];
  const name = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)];
  return `${adj}${name}`;
}

// 创建接力消息
export function createRelayMessage(text: string, existingCodes: string[]): RelayMessage {
  const now = new Date().toISOString();
  return {
    id: `relay-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    text: text.trim().slice(0, 120),
    shareCode: generateShareCode(existingCodes),
    senderAlias: generateAlias(),
    createdAt: now
  };
}

// 添加我的消息
export function addMyMessage(state: RelayState, message: RelayMessage): RelayState {
  const chain: RelayChain = {
    shareCode: message.shareCode,
    originalMessage: message,
    responses: [],
    reachCount: 1,
    totalNodes: 1,
    lastUpdated: new Date().toISOString()
  };

  return {
    ...state,
    myMessages: [...state.myMessages, message],
    createdCodes: [...state.createdCodes, message.shareCode],
    chainsIKnowAbout: [chain, ...state.chainsIKnowAbout],
    totalReach: state.totalReach + 1
  };
}

// 记录兑换码（防止重复领取）
export function recordCodeRedemption(state: RelayState, code: string): RelayState {
  if (state.redeemedCodes.includes(code)) return state;
  return {
    ...state,
    redeemedCodes: [...state.redeemedCodes, code]
  };
}

// 添加回应
export function addResponse(state: RelayState, response: RelayResponse): RelayState {
  const updatedChains = state.chainsIKnowAbout.map(chain => {
    if (chain.shareCode === response.relayMessageId || chain.originalMessage.shareCode === response.relayMessageId) {
      return {
        ...chain,
        responses: [...chain.responses, response],
        reachCount: chain.reachCount + 1,
        totalNodes: chain.totalNodes + 1,
        lastUpdated: new Date().toISOString()
      };
    }
    return chain;
  });

  return {
    ...state,
    myResponses: [...state.myResponses, response],
    chainsIKnowAbout: updatedChains,
    totalReach: state.totalReach + 1
  };
}

// 根据分享码查找接力链
export function findChainByCode(state: RelayState, code: string): RelayChain | undefined {
  return state.chainsIKnowAbout.find(
    c => c.shareCode === code || c.originalMessage.shareCode === code
  );
}

// 获取我的影响统计
export function getMyRelayStats(state: RelayState) {
  const myCodes = new Set(state.myMessages.map(m => m.shareCode));
  const myChains = state.chainsIKnowAbout.filter(c => myCodes.has(c.shareCode) || myCodes.has(c.originalMessage.shareCode));
  const totalReach = myChains.reduce((sum, c) => sum + c.reachCount, 0);
  const maxReach = myChains.reduce((max, c) => Math.max(max, c.reachCount), 0);
  return {
    totalMessages: state.myMessages.length,
    totalResponses: state.myResponses.length,
    totalChains: myChains.length,
    totalReach,
    maxReach,
    totalRewards: state.totalRewardsEarned
  };
}

// 安全过滤
const BLOCKED_PATTERNS = [/暴力|攻击|自杀|自残|伤害|色情|赌博|毒品/];

export function sanitizeRelayMessage(text: string): { safe: boolean; cleaned: string; reason?: string } {
  const cleaned = text.trim().slice(0, 120);
  if (cleaned.length < 3) {
    return { safe: false, cleaned: '', reason: '消息太短，请写下至少 3 个字' };
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(cleaned)) {
      return { safe: false, cleaned: '', reason: '消息包含不适合的内容，请修改后重新发送' };
    }
  }
  return { safe: true, cleaned };
}
