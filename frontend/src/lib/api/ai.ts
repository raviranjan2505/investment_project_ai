import { get, post } from './client';

export interface AiChatResponse {
  reply: string;
}

export interface AiPlanSuggestionResponse {
  suggested_plan_slug: string;
  rationale: string;
  risk_notes: string[];
  alternative_plan_slug: string | null;
}

export interface AiFraudCheckResponse {
  risk_score: number;
  risk_level: string;
  reasons: string[];
  recommended_action: string;
}

export async function askAi(token: string, message: string): Promise<AiChatResponse> {
  return post<AiChatResponse>('/ai/chat', { message }, token);
}

export async function suggestAiPlan(token: string): Promise<AiPlanSuggestionResponse> {
  return get<AiPlanSuggestionResponse>('/ai/suggest-plan', token);
}

export async function checkAiRisk(
  token: string,
  activity: Record<string, unknown>
): Promise<AiFraudCheckResponse> {
  return post<AiFraudCheckResponse>('/ai/fraud-check', { activity }, token);
}
