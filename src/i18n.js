import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// namespaces
import i18nCommonIt from './Common/Locales/it/i18n.json'
import i18nCommonEn from './Common/Locales/en/i18n.json'
import i18nDashboardIt from './Dashboard/Locales/it/i18n.json'
import i18nDashboardEn from './Dashboard/Locales/en/i18n.json'
import LanguageDetector from 'i18next-browser-languagedetector'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  it: {
    common: i18nCommonIt,
    dashboard: i18nDashboardIt,
  },
  en: {
    common: i18nCommonEn,
    dashboard: i18nDashboardEn,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // language to use, you can use the i18n.changeLanguage function
    // to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // react already saves from xss
    },
  })

export default i18n
