export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AISettings {
  enabled: boolean;
  systemPrompt: string;
  dailyLimit: number;
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
