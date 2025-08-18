import { useEffect, useMemo, useState } from 'react'
import { fetchDobbyStrategies, type DobbyRequestPayload, type DobbyResponse } from '@/services/dobby'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import Disclaimer from '@/components/Disclaimer'
import { motion } from 'framer-motion'

const Chat = () => {
  const { t, i18n } = useTranslation()
  const [strategy, setStrategy] = useState<DobbyResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const lastPayload: DobbyRequestPayload | null = useMemo(() => {
    const raw = localStorage.getItem('lastPayload')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const listener = async (event: Event) => {
      const custom = event as CustomEvent<DobbyRequestPayload>
      setIsLoading(true)
      try {
        const response = await fetchDobbyStrategies(custom.detail, i18n.language)
        setStrategy(response)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }

    window.addEventListener('wizard-submit', listener as EventListener)
    return () => window.removeEventListener('wizard-submit', listener as EventListener)
  }, [i18n.language])

  useEffect(() => {
    void (async () => {
      if (!lastPayload) return
      setIsLoading(true)
      try {
        const response = await fetchDobbyStrategies(lastPayload, i18n.language)
        setStrategy(response)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    })()
  }, [lastPayload, i18n.language])

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="space-y-4">
      <Disclaimer />
      <h3 className="text-lg font-semibold">{t('result')}</h3>
      {isLoading && <div className="text-sm text-muted-foreground">{t('loading')}</div>}
      {strategy ? (
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl border p-4">
            <div className="text-sm text-muted-foreground mb-2">{t('summary')}</div>
            <div>{strategy.summary}</div>
          </motion.div>
          <motion.div variants={listVariants} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-3">
            {(['conservative', 'balanced', 'risky'] as const).map((key) => (
              <motion.div key={key} variants={itemVariants} className="rounded-2xl border p-4">
                <div className="text-xs uppercase text-muted-foreground">{key}</div>
                <div className="font-semibold">{strategy.strategies[key].title}</div>
                <div className="text-sm text-muted-foreground">{strategy.strategies[key].description}</div>
                <div className="text-sm">{t('risk')}: {strategy.strategies[key].riskLevel}</div>
                <div className="text-sm">{t('apy')}: {strategy.strategies[key].expectedAPY}</div>
                {strategy.strategies[key].links && strategy.strategies[key].links!.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {strategy.strategies[key].links!.map((link, linkIndex) => (
                      <a key={linkIndex} href={link} target="_blank" rel="noreferrer" className="text-primary underline break-all transition hover:opacity-80">{link}</a>
                    ))}
                  </div>
                )}
                {strategy.strategies[key].guide && (
                  <div className="mt-3 text-sm whitespace-pre-wrap">{strategy.strategies[key].guide}</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">{t('no_result')}</div>
      )}
    </section>
  )
}

export default Chat 