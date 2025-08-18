export type DobbyRequestPayload = {
  token: string
  amount: string
  goal: 'staking' | 'farming' | 'dex_liquidity'
  duration: string
}

export type Strategy = {
  title: string
  description: string
  riskLevel: string
  expectedAPY: string
  links?: string[]
  guide?: string
}

export type DobbyResponse = {
  summary: string
  strategies: {
    conservative: Strategy
    balanced: Strategy
    risky: Strategy
  }
}

const DOBBY_MODEL_ID = 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b'
const API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions'

const buildSystemPrompt = (languageCode: string): string => {
  return [
    'You are an AI DeFi Assistant.',
    'Reply ONLY with valid minified JSON matching this TypeScript type:',
    'type Strategy = { title: string; description: string; riskLevel: string; expectedAPY: string; links?: string[]; guide?: string }',
    'type Response = { summary: string; strategies: { conservative: Strategy; balanced: Strategy; risky: Strategy } }',
    `Respond in the user interface language: ${languageCode}.`,
    'Do not include markdown, comments, or any extra text.'
  ].join('\n')
}

const buildUserPrompt = (payload: DobbyRequestPayload): string => {
  const { token, amount, goal, duration } = payload
  return [
    `User params: token=${token}, amount=${amount}, goal=${goal}, duration=${duration}.`,
    'Return JSON with:',
    '- summary in 1-2 sentences.',
    '- three strategies tuned to the goal with realistic APY and risk levels.',
    '- for each strategy include: optional links to recommended products (links), and a short practical guide (guide) with actionable steps.'
  ].join('\n')
}

export const fetchDobbyStrategies = async (payload: DobbyRequestPayload, languageCode?: string): Promise<DobbyResponse> => {
  const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY
  if (!apiKey) throw new Error('Missing VITE_FIREWORKS_API_KEY')
  const uiLanguage = (languageCode || (navigator.language.split('-')[0] ?? 'en')).toLowerCase()

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: DOBBY_MODEL_ID,
      max_tokens: 4096,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
      messages: [
        { role: 'system', content: buildSystemPrompt(uiLanguage) },
        { role: 'user', content: buildUserPrompt(payload) }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`Dobby request failed: ${response.status}`)
  }

  const json = await response.json()
  const text: string = json.choices?.[0]?.message?.content ?? '{}'
  let parsed: DobbyResponse
  try {
    parsed = JSON.parse(text) as DobbyResponse
  } catch {
    const cleaned = String(text).replace(/^```json\n?|\n?```$/g, '')
    parsed = JSON.parse(cleaned) as DobbyResponse
  }

  try {
    const item = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      payload: JSON.stringify(payload),
      summary: parsed.summary
    }
    const key = 'historyDialogues'
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as unknown[]
    const next = [item, ...existing].slice(0, 5)
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // ignore
  }

  return parsed
} 