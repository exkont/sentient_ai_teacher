import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from '@/pages/Home'
import History from '@/pages/History'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ChatFree from '@/pages/ChatFree'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import MobileMenu from '@/components/MobileMenu'
import Lesson from '@/pages/Lesson'

const App = () => {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBackground />
      <header className="border-b border-border relative z-10">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src="/Logo_black.png" alt="Logo" className="w-7 h-7" />
            <Link to="/" className="text-lg font-semibold">{t('title')}</Link>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/lesson" className="hover:underline">{t('lesson', 'Урок')}</Link>
            <Link to="/free-chat" className="hover:underline">{t('free_chat')}</Link>
            <Link to="/history" className="hover:underline">{t('history')}</Link>
            <LanguageSwitcher />
          </nav>
          <button className="md:hidden rounded-md border p-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="container py-6 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/free-chat" element={<ChatFree />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <Outlet />
      </main>
    </div>
  )
}

export default App
