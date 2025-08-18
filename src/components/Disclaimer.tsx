import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Disclaimer = () => {
  const { t } = useTranslation()
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl border p-4 flex items-start gap-3 bg-secondary/40">
      <img src="/dobby 2.png" alt="Mascot" className="w-10 h-10 rounded-full" />
      <div className="text-xs leading-relaxed">
        <div>{t('disclaimer_links')}</div>
        <div className="mt-1 text-muted-foreground">{t('disclaimer_no_advice')}</div>
      </div>
    </motion.div>
  )
}

export default Disclaimer 