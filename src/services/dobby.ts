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

export type TeacherFollowUp = {
  id: string
  label: string
}

export type TeacherResponse = {
  answer: string
  follow_up_questions: TeacherFollowUp[]
}

const DOBBY_MODEL_ID = 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b'
const API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions'

const safeExtractJson = (raw: unknown): string => {
  const text = String(raw ?? '')
  // Try fenced code block first
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i)
  if (fenceMatch && fenceMatch[1]) return fenceMatch[1].trim()
  // Try first { ... } block heuristically
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1)
  }
  // Fallback to original text
  return text
}

const buildSystemPrompt = (languageCode: string): string => {
  return [
    'You are an AI DeFi Assistant.',
    'Reply ONLY with valid minified JSON matching this TypeScript type:',
    'type Strategy = { title: string; description: string; riskLevel: string; expectedAPY: string; links?: string[]; guide?: string }',
    'type Response = { summary: string; strategies: { conservative: Strategy; balanced: Strategy; risky: Strategy } }',
    `Respond STRICTLY in the user interface language: ${languageCode}.`,
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
  const rawText: string = json.choices?.[0]?.message?.content ?? '{}'
  const cleaned = safeExtractJson(rawText)
  const parsed = JSON.parse(cleaned) as DobbyResponse

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

const buildTeacherSystemPrompt = (languageCode: string): string => {
  return [
    'You are an AI crypto teacher for interactive lessons.',
    'Respond ONLY with valid minified JSON matching this TypeScript type:',
    'type FollowUp = { id: string; label: string }',
    'type TeacherResponse = { answer: string; follow_up_questions: FollowUp[] }',
    `Language STRICTLY: ${languageCode}.`,
    'No markdown or extra text.',
    'ALWAYS return 3-5 follow_up_questions related to the current topic or suggest new adjacent topics when the current branch is exhausted.'
  ].join('\n')
}

const buildTeacherUserPrompt = (topic: string, path: string[], lastAnswer?: string): string => {
  const pathInfo = path.length ? `Path: ${path.join(' > ')}` : 'Path: root'
  const last = lastAnswer ? `\nPrevious answer: ${lastAnswer.slice(0, 500)}` : ''
  return [
    `Topic: ${topic}.`,
    pathInfo,
    'Generate an explanation "answer" and 3-5 "follow_up_questions" to continue the dialogue.',
    'If there is nothing else to ask about this branch, propose other related subtopics so the learning never stops.',
    'Each follow_up_questions item must have a stable id and a human-readable label.',
    'Keep the answer short (<= 120 words).',
    last
  ].join('\n')
}

export const fetchDobbyTeacher = async (
  params: { topic: string; path: string[]; lastAnswer?: string },
  languageCode?: string
): Promise<TeacherResponse> => {
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
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: 'system', content: buildTeacherSystemPrompt(uiLanguage) },
        { role: 'user', content: buildTeacherUserPrompt(params.topic, params.path, params.lastAnswer) }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`Dobby request failed: ${response.status}`)
  }

  const json = await response.json()
  const rawText: string = json.choices?.[0]?.message?.content ?? '{}'
  const cleaned = safeExtractJson(rawText)
  const parsed = JSON.parse(cleaned) as TeacherResponse

  // Localized fallback follow-ups
  if (!parsed.follow_up_questions || parsed.follow_up_questions.length === 0) {
    const lang = uiLanguage
    const fallbacksByLang: Record<string, TeacherFollowUp[]> = {
      en: [
        { id: 'what_next', label: 'What to learn next?' },
        { id: 'basics', label: 'Basics and key terms' },
        { id: 'practice', label: 'Practical examples' }
      ],
      ru: [
        { id: 'what_next', label: 'Что изучить дальше?' },
        { id: 'basics', label: 'Основы и термины' },
        { id: 'practice', label: 'Практические примеры' }
      ],
      uk: [
        { id: 'what_next', label: 'Що вивчати далі?' },
        { id: 'basics', label: 'Базові поняття' },
        { id: 'practice', label: 'Практичні приклади' }
      ],
      tr: [
        { id: 'what_next', label: 'Sırada ne var?' },
        { id: 'basics', label: 'Temeller ve terimler' },
        { id: 'practice', label: 'Pratik örnekler' }
      ],
      zh: [
        { id: 'what_next', label: '接下来学什么？' },
        { id: 'basics', label: '基础与术语' },
        { id: 'practice', label: '实践示例' }
      ]
    }
    parsed.follow_up_questions = fallbacksByLang[lang] ?? fallbacksByLang.en
  }

  return parsed
} 