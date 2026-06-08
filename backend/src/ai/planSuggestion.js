import { askJson } from './openaiClient.js';

export async function suggestPlan({ user, plans, wallet }) {
  return askJson(
    'Suggest a suitable investment plan for the given user profile and available plans. Base the suggestion only on the provided data. Return JSON with suggested_plan_slug, rationale, risk_notes array, and alternative_plan_slug. Do not promise profits or guarantee results.',
    JSON.stringify({ user, plans, wallet })
  );
}
