import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export type SavedDialogue = {
  id: string
  createdAt: number
  payload: string
  summary: string
}

const STORAGE_KEY = 'historyDialogues'

const History = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [items, setItems] = useState<SavedDialogue[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as SavedDialogue[]
      setItems(parsed.slice(0, 5))
    } catch {
      // ignore
    }
  }, [])

  const handleReplay = (payloadString: string) => {
    try {
      const payload = JSON.parse(payloadString)
      localStorage.setItem('lastPayload', JSON.stringify(payload))
      window.dispatchEvent(new CustomEvent('wizard-submit', { detail: payload }))
      navigate('/chat')
    } catch {
      // ignore
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{t('history')}</h2>
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t('history_empty')}</div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <button key={item.id} onClick={() => handleReplay(item.payload)} className="text-left rounded-2xl border p-4 transition hover:bg-secondary hover:text-black">
              <div className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
              <div className="text-sm mt-1 break-all">{item.payload}</div>
              <div className="mt-2">{item.summary}</div>
              <div className="mt-2 text-primary underline text-sm">{t('retry')}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default History 