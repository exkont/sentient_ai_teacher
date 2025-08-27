import { useState } from 'react'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const ChatFree = () => {
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState<string>('')
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY
    if (!apiKey) {
      setHistory((prev) => [...prev, { role: 'assistant', content: 'Missing VITE_FIREWORKS_API_KEY' }])
      return
    }

    const prompt = input
    setHistory((prev) => [...prev, { role: 'user', content: prompt }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b',
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            { role: 'system', content: `You are a helpful assistant. Respond strictly in ${i18n.language}.` },
            { role: 'user', content: prompt }
          ]
        })
      })
      const json = await response.json()
      const text: string = json.choices?.[0]?.message?.content ?? ''
      setHistory((prev) => [...prev, { role: 'assistant', content: text }])
    } catch {
      setHistory((prev) => [...prev, { role: 'assistant', content: 'Request failed' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleSend()
    }
  }

  return (
    <section className="max-w-2xl mx-auto flex flex-col gap-4 h-[calc(100vh-160px)] md:h-[calc(100vh-180px)]">
      <div className="rounded-xl border p-4 overflow-auto flex-1">
        {history.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block rounded-2xl px-3 py-2 my-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-black'}`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-muted-foreground">{t('loading')}</div>}
      </div>
      <div className="flex gap-2 sticky bottom-0">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} className="flex-1 rounded-md bg-background border px-3 py-2" placeholder={t('free_chat_input_placeholder') ?? ''} />
        <button onClick={handleSend} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{t('free_chat_send')}</button>
      </div>
    </section>
  )
}

export default ChatFree 