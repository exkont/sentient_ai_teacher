import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const Home = () => {
  const { t } = useTranslation()
  return (
    <section className="flex flex-col items-center gap-6 py-8 md:py-10">
      <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} src="/Logo_black.png" alt="Logo" className="w-20 h-20 md:w-24 md:h-24" />
      <motion.img initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }} src="/dobby 1.png" alt="Mascot" className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-2 ring-primary/60" />
      <motion.h1 initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl md:text-3xl font-bold text-center">{t('title')}</motion.h1>
      <motion.p initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="text-muted-foreground max-w-prose text-center px-4 md:px-0">
        {t('home_description', 'Подберите DeFi-стратегии (стейкинг, фарминг, ликвидность) под ваши цели. Модель dobby подготовит объяснение стратегий, рисков и доходности.')}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        <Link to="/wizard" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">{t('start')}</Link>
        <Link to="/history" className="px-4 py-2 rounded-md border border-border">{t('history')}</Link>
        <Link to="/free-chat" className="px-4 py-2 rounded-md border border-border">{t('free_chat', 'Свободный чат')}</Link>
      </motion.div>
      <motion.img initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} src="/Sign 1.png" alt="Sign" className="w-12 h-12 md:w-16 md:h-16 opacity-75" />
    </section>
  )
}

export default Home 