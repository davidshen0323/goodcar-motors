import { useI18n } from '../i18n/I18nProvider';
export default function Feedback({
  message,
  error = false,
}: {
  message?: string;
  error?: boolean;
}) {
  const { t } = useI18n();
  if (!message) return null;
  return (
    <p
      className={`feedback ${error ? 'feedback-error' : ''}`}
      role={error ? 'alert' : 'status'}
    >
      {t(message)}
    </p>
  );
}
