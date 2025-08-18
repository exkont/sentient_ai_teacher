import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import ru from '@/locales/ru.json'
import uk from '@/locales/uk.json'
import ua from '@/locales/uk.json'
import tr from '@/locales/tr.json'
import zh from '@/locales/zh.json'

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uk: { translation: uk },
  ua: { translation: ua },
  tr: { translation: tr },
  zh: { translation: zh }
}

void i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: (navigator.language.split('-')[0] || 'en').toLowerCase(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18next 