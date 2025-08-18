import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const languages = ['ru', 'en', 'zh', 'ua', 'tr']
  const changeLanguage = (languageCode: string) => {
    void i18n.changeLanguage(languageCode)
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      {languages.map((languageCode) => (
        <button key={languageCode} onClick={() => changeLanguage(languageCode)} className={`px-2 py-1 rounded-md border transition ${i18n.language === languageCode ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
          {languageCode.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher 