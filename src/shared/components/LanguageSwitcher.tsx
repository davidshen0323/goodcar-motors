import { useI18n } from '../i18n/I18nProvider';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <nav
      className="language-bar"
      aria-label={language === 'en' ? 'Website language' : '網站語言'}
    >
      <span className="language-caption">
        {language === 'en' ? 'LANGUAGE' : '語言'}
      </span>
      <div>
        {(
          [
            ['zh', '繁體中文'],
            ['en', 'English'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            lang={value === 'zh' ? 'zh-Hant' : 'en'}
            aria-pressed={language === value}
            onClick={() => setLanguage(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
