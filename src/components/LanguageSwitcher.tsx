export type LanguageOption = {
  code: string
  label: string
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
  { code: 'tr', label: 'TR' },
  { code: 'zh', label: '中文' }
]

import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value)
  }

  return (
    <select value={i18n.language} onChange={handleChange} className="rounded-md border px-2 py-1 bg-background">
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  )
}

export default LanguageSwitcher 