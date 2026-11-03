import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function Modal({
  open,
  onClose,
  title,
  children,
}: PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label={t(title)}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog-head">
        <h2>{t(title)}</h2>
        <button type="button" onClick={onClose} aria-label={t('關閉視窗')}>
          ×
        </button>
      </div>
      {open && children}
    </dialog>
  );
}
