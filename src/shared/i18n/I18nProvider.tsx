import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  initialLanguage,
  translate,
  type Language,
  type Translate,
} from './translate';
import type { PropsWithChildren } from 'react';
interface I18nValue {
  language: Language;
  setLanguage: (next: Language) => void;
  t: Translate;
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState(() =>
    initialLanguage(location.search, {
      getItem: (key) => window.localStorage.getItem(key),
    }),
  );

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('lang');
    if (requested === 'en' || requested === 'zh') setLanguageState(requested);
  }, [location.search]);

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
    try {
      localStorage.setItem('atelier-language', language);
    } catch {
      /* Preference storage is optional. */
    }
  }, [language]);

  const setLanguage = useCallback(
    (next: Language) => {
      if (!['zh', 'en'].includes(next)) return;
      setLanguageState(next);
      const search = new URLSearchParams(location.search);
      search.set('lang', next);
      navigate(
        {
          pathname: location.pathname,
          search: search.toString(),
          hash: location.hash,
        },
        { replace: true },
      );
    },
    [location, navigate],
  );

  const t = useCallback<Translate>(
    (text, variables) => translate(text, language, variables),
    [language],
  );
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      locale: language === 'en' ? 'en-US' : 'zh-TW',
    }),
    [language, setLanguage, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
