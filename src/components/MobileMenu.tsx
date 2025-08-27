import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { t } = useTranslation()
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50" onClick={onClose}>
          <motion.div initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} className="absolute top-0 left-0 right-0 bg-background border-b border-border p-4 rounded-b-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/Logo_black.png" alt="Logo" className="w-8 h-8" />
                <span className="font-semibold">{t('title')}</span>
              </div>
              <button onClick={onClose} className="rounded-md border p-2 hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            <nav className="mt-4 grid gap-2 text-base">
              <Link to="/lesson" onClick={onClose} className="rounded-md border px-3 py-2">{t('lesson', 'Урок')}</Link>
              <Link to="/free-chat" onClick={onClose} className="rounded-md border px-3 py-2">{t('free_chat')}</Link>
              <Link to="/history" onClick={onClose} className="rounded-md border px-3 py-2">{t('history')}</Link>
              <div className="pt-2 border-t border-border">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu 