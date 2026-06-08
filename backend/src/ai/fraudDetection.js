import { askJson } from './openaiClient.js';

export async function detectFraud({ user, activity }) {
  return askJson(
    'You are a risk analyst for an investment platform. Assess the supplied user activity for suspicious or unusual patterns only. Do not accuse the user of wrongdoing. Return JSON with risk_score 0-100, risk_level, reasons array, and recommended_action. Keep the output concise and factual.',
    JSON.stringify({ user, activity })
  );
}
