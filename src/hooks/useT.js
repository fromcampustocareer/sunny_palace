import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import { en } from '../translations/en'

// English is bundled (the default language). Spanish is a separate chunk the
// provider fetches on demand. Until it arrives — or for any key missing in the
// active language — fall back to English.
export function useT(namespace) {
  const { dict } = useContext(LanguageContext)
  return dict?.[namespace] ?? en[namespace]
}
