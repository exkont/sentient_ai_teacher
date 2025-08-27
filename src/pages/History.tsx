import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export type TeacherSavedSession = {
  id: string
  createdAt: number
  topic: string
  steps: Array<{ label: string; answer: string }>
}

const STORAGE_KEY = 'teacherHistorySessions'

const History = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [items, setItems] = useState<TeacherSavedSession[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as TeacherSavedSession[]
      setItems(parsed.slice(0, 10))
    } catch {
      // ignore
    }
  }, [])

  const handleOpen = (session: TeacherSavedSession) => {
    localStorage.setItem('teacherLastSession', JSON.stringify(session))
    navigate('/lesson')
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{t('history')}</h2>
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t('history_empty')}</div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <button key={item.id} onClick={() => handleOpen(item)} className="text-left rounded-2xl border p-4 transition hover:bg-secondary hover:text-black">
              <div className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
              <div className="font-semibold mt-1 break-words">{item.topic}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t('lesson_steps_count', { defaultValue: 'Шагов: {{n}}', n: item.steps.length })}</div>
              <div className="mt-2 text-primary underline text-sm">{t('open', { defaultValue: 'Открыть' })}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default History 