import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchTopTokens } from '@/services/coingecko'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export type StrategyGoal = 'staking' | 'farming' | 'dex_liquidity'

const defaultTokens: string[] = [
  'USDC', 'USDT', 'ETH', 'WBTC', 'DAI', 'SOL', 'BNB', 'ARB', 'OP', 'AVAX'
]

const durations: Array<{ key: string; value: string }> = [
  { key: 'duration_1m', value: '1 month' },
  { key: 'duration_6m', value: '6 months' },
  { key: 'duration_1y', value: '1 year' },
  { key: 'duration_10y', value: '10 years' }
]

const Wizard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [token, setToken] = useState<string>('USDC')
  const [tokens, setTokens] = useState<string[]>(defaultTokens)
  const [amount, setAmount] = useState<number>(1000)
  const [goal, setGoal] = useState<StrategyGoal>('staking')
  const [duration, setDuration] = useState<string>('6 months')

  const isLastStep: boolean = stepIndex === 3
  const progressPercent: number = useMemo(() => ((stepIndex + 1) / 4) * 100, [stepIndex])

  useEffect(() => {
    void (async () => {
      try {
        const list = await fetchTopTokens()
        if (list.length > 0) {
          setTokens(list)
          if (!list.includes(token)) setToken(list[0])
        }
      } catch {
        setTokens(defaultTokens)
      }
    })()
  }, [])

  const handleNext = () => {
    if (isLastStep) return
    setStepIndex((prev) => Math.min(prev + 1, 3))
  }

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    const payload = {
      token,
      amount: String(amount),
      goal,
      duration
    }
    localStorage.setItem('lastPayload', JSON.stringify(payload))
    window.dispatchEvent(new CustomEvent('wizard-submit', { detail: payload }))
    navigate('/chat')
  }

  return (
    <section className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="h-2 w-full rounded bg-secondary">
          <div className="h-2 rounded bg-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stepIndex === 0 && (
          <motion.div key="step-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <div className="text-sm text-muted-foreground">{t('wizard_step', { n: 1 })}</div>
            <h2 className="text-xl font-semibold">{t('wizard_token')}</h2>
            <select value={token} onChange={(event) => setToken(event.target.value)} className="w-full rounded-md bg-background border px-3 py-2">
              {tokens.map((symbol) => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </motion.div>
        )}

        {stepIndex === 1 && (
          <motion.div key="step-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <div className="text-sm text-muted-foreground">{t('wizard_step', { n: 2 })}</div>
            <h2 className="text-xl font-semibold">{t('wizard_amount')}</h2>
            <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} min={100} max={10000} step={50} className="w-full rounded-md bg-background border px-3 py-2" />
            <input type="range" min={100} max={10000} step={50} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="w-full" />
          </motion.div>
        )}

        {stepIndex === 2 && (
          <motion.div key="step-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <div className="text-sm text-muted-foreground">{t('wizard_step', { n: 3 })}</div>
            <h2 className="text-xl font-semibold">{t('wizard_goal')}</h2>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setGoal('staking')} className={`rounded-md border px-3 py-2 ${goal === 'staking' ? 'bg-primary text-primary-foreground' : ''}`}>{t('goal_staking')}</button>
              <button onClick={() => setGoal('farming')} className={`rounded-md border px-3 py-2 ${goal === 'farming' ? 'bg-primary text-primary-foreground' : ''}`}>{t('goal_farming')}</button>
              <button onClick={() => setGoal('dex_liquidity')} className={`rounded-md border px-3 py-2 ${goal === 'dex_liquidity' ? 'bg-primary text-primary-foreground' : ''}`}>{t('goal_dex_liquidity')}</button>
            </div>
          </motion.div>
        )}

        {stepIndex === 3 && (
          <motion.div key="step-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <div className="text-sm text-muted-foreground">{t('wizard_step', { n: 4 })}</div>
            <h2 className="text-xl font-semibold">{t('wizard_duration')}</h2>
            <select value={duration} onChange={(event) => setDuration(event.target.value)} className="w-full rounded-md bg-background border px-3 py-2">
              {durations.map(({ key, value }) => (
                <option key={key} value={value}>{t(key)}</option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={handlePrev} disabled={stepIndex === 0} className="rounded-md border px-4 py-2 disabled:opacity-50">{t('back')}</button>
        {!isLastStep ? (
          <button onClick={handleNext} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{t('next')}</button>
        ) : (
          <button onClick={handleSubmit} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{t('get_strategy')}</button>
        )}
      </div>
    </section>
  )
}

export default Wizard 