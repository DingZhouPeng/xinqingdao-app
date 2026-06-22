export interface RelayMessage {
  id: string;
  text: string;
  shareCode: string;
  senderAlias: string;
  createdAt: string;
}

export interface RelayResponse {
  id: string;
  relayMessageId: string;
  text: string;
  responderAlias: string;
  createdAt: string;
}

export interface RelayChain {
  shareCode: string;
  originalMessage: RelayMessage;
  responses: RelayResponse[];
  reachCount: number;
  totalNodes: number;
  lastUpdated: string;
}

export interface RelayState {
  myMessages: RelayMessage[];
  myResponses: RelayResponse[];
  chainsIKnowAbout: RelayChain[];
  totalReach: number;
  totalRewardsEarned: number;
  createdCodes: string[];
  redeemedCodes: string[];
}
