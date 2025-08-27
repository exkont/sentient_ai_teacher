import { useEffect, useState } from 'react'
import { fetchDobbyTeacher, type TeacherResponse } from '@/services/dobby'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

export type LessonStep = {
  id: string
  label: string
  answer: string
}

const STORAGE_KEY_SESSIONS = 'teacherHistorySessions'

const getDefaultTopic = (lang: string): string => {
  const map: Record<string, string> = {
    ru: 'Что такое блокчейн?',
    uk: 'Що таке блокчейн?',
    ua: 'Що таке блокчейн?',
    tr: 'Blockchain nedir?',
    zh: '什么是区块链？',
    en: 'What is blockchain?'
  }
  const key = (lang || 'en').toLowerCase()
  return map[key] ?? map.en
}

const Lesson = () => {
  const { t, i18n } = useTranslation()
  const [topic, setTopic] = useState<string>(getDefaultTopic(i18n.language))
  const [path, setPath] = useState<string[]>([])
  const [current, setCurrent] = useState<TeacherResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [steps, setSteps] = useState<LessonStep[]>([])

  const canGoBack: boolean = steps.length > 0

  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherLastSession')
      if (!raw) return
      const session = JSON.parse(raw) as { topic: string; steps: Array<{ label: string; answer: string }> }
      setTopic(session.topic)
      setSteps(session.steps.map((s) => ({ id: crypto.randomUUID(), ...s })))
      setPath(session.steps.map((s) => s.label).slice(1))
      const last = session.steps[session.steps.length - 1]
      if (last) setCurrent({ answer: last.answer, follow_up_questions: [] })
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    // обновлять плейсхолдер темы при смене языка, если пользователь не начал урок
    if (steps.length === 0) {
      setTopic(getDefaultTopic(i18n.language))
    }
  }, [i18n.language, steps.length])

  const persistSession = (baseTopic: string, historySteps: LessonStep[]) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSIONS) || '[]') as unknown[]
      const item = { id: crypto.randomUUID(), createdAt: Date.now(), topic: baseTopic, steps: historySteps }
      const next = [item, ...existing].slice(0, 10)
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(next))
      localStorage.setItem('teacherLastSession', JSON.stringify(item))
    } catch {
      // ignore
    }
  }

  const ask = async (nextLabel?: string) => {
    const actual = nextLabel ?? topic
    setIsLoading(true)
    try {
      const response = await fetchDobbyTeacher({ topic, path: nextLabel ? [...path, nextLabel] : path, lastAnswer: current?.answer }, i18n.language)
      setCurrent(response)
      const step: LessonStep = { id: crypto.randomUUID(), label: actual, answer: response.answer }
      setSteps((prev) => {
        const updated = [...prev, step]
        persistSession(topic, updated)
        return updated
      })
      if (nextLabel) setPath((prev) => [...prev, nextLabel])
    } catch {
      setCurrent({ answer: 'Request failed', follow_up_questions: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setSteps((prev) => {
      if (prev.length === 0) return prev
      const next = prev.slice(0, -1)
      setPath((p) => p.slice(0, -1))
      const last = next[next.length - 1]
      setCurrent(last ? { answer: last.answer, follow_up_questions: [] } : null)
      persistSession(topic, next)
      return next
    })
  }

  const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }

  return (
    <section className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">{t('lesson_title', 'Интерактивный урок')}</h1>
      <div className="rounded-2xl border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className="flex-1 rounded-md bg-background border px-3 py-2" placeholder={t('teacher_topic_placeholder') ?? ''} />
          <button onClick={() => void ask()} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{t('ask')}</button>
          <button onClick={handleBack} disabled={!canGoBack} className="rounded-md border px-3 py-2 disabled:opacity-50">{t('back')}</button>
        </div>
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">{t('loading')}</motion.div>
          )}
        </AnimatePresence>
        {steps.length > 0 && (
          <div className="rounded-lg border p-3 max-h-72 overflow-auto space-y-3 bg-secondary/30">
            <motion.div variants={listVariants} initial="hidden" animate="show" className="grid gap-3">
              {steps.map((step) => (
                <motion.div key={step.id} variants={itemVariants} className="space-y-1">
                  <div className="text-xs text-muted-foreground">{t('lesson_step', { defaultValue: 'Шаг' })}: {step.label}</div>
                  <div className="text-sm whitespace-pre-wrap">{step.answer}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
        {current && current.follow_up_questions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {current.follow_up_questions.map((q) => (
              <button key={q.id} onClick={() => void ask(q.label)} className="rounded-full border px-3 py-1 text-sm transition hover:bg-secondary hover:text-black">{q.label}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Lesson 