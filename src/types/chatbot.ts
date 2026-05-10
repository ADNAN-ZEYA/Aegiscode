export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AISettings {
  enabled: boolean;
  systemPrompt: string;
  dailyLimit: number;
  roadmapEnabled: boolean;
  roadmapSystemPrompt: string;
  plannerEnabled: boolean;
  maxRoadmapWeeks: number;
}

export interface AIAnalytics {
  date: string;
  totalConversations: number;
  userConversations: Record<string, number>;
}

export interface PageContext {
  title: string;
  content: string;
}
