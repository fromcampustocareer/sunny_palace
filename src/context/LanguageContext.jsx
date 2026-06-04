import { createContext, useContext, useState } from 'react'

export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => { throw new Error('useLang must be used inside LanguageProvider') },
})

// localStorage can throw in private mode / storage-disabled browsers — guard every access
// so the provider (which wraps the whole app) can never white-screen on mount or toggle.
function readStoredLang() {
  try {
    return localStorage.getItem('jj-lang') ?? 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  function toggle(newLang) {
    setLang(newLang)
    try {
      localStorage.setItem('jj-lang', newLang)
    } catch {
      // ignore — language still updates in memory for this session
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
