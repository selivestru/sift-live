import { t, type Dictionary } from 'intlayer'

const profileContent = {
  key: 'profile',
  content: {
    account: t({
      en: 'Account',
      uk: 'Акаунт',
      ru: 'Аккаунт',
    }),
    stream: t({
      en: 'Stream',
      uk: 'Трансляція',
      ru: 'Трансляция',
    }),
    profile: t({
      en: 'Profile',
      uk: 'Профіль',
      ru: 'Профиль',
    }),
    streamKeyTitle: t({
      en: 'Stream Key',
      uk: 'Ключ трансляції',
      ru: 'Ключ трансляции',
    }),
    show: t({
      en: 'Show',
      uk: 'Показати',
      ru: 'Показать',
    }),
    hide: t({
      en: 'Hide',
      uk: 'Приховати',
      ru: 'Скрыть',
    }),
    copy: t({
      en: 'Copy',
      uk: 'Копіювати',
      ru: 'Копировать',
    }),
    copied: t({
      en: 'Copied',
      uk: 'Скопійовано',
      ru: 'Скопировано',
    }),
    reset: t({
      en: 'Reset',
      uk: 'Скинути',
      ru: 'Сбросить',
    }),
    resetSuccess: t({
      en: 'Reset successful',
      uk: 'Скидання успішне',
      ru: 'Сброс выполнен',
    }),
    resetFailed: t({
      en: 'Reset failed',
      uk: 'Помилка скидання',
      ru: 'Не удалось сбросить',
    }),
    streamKeyModalTitle: t({
      en: 'Stream Key',
      uk: 'Ключ трансляції',
      ru: 'Ключ трансляции',
    }),
    streamKeyModalWarning: t({
      en: 'Never share your stream key with anyone and do not show it during your stream!',
      uk: 'Ніколи і нікому не повідомляйте свій ключ трансляції та не показуйте його під час трансляції!',
      ru: 'Никогда и никому не сообщайте свой ключ трансляции и не показывайте его в процессе!',
    }),
    streamKeyModalHint: t({
      en: 'Click "Understand" if you understood the above and want to see your stream key.',
      uk: 'Натисніть «Зрозуміло», якщо ви зрозуміли вищесказане і хочете побачити свій ключ трансляції.',
      ru: 'Нажмите «Понятно», если вы поняли сказанное выше и хотите увидеть свой ключ трансляции.',
    }),
    understand: t({
      en: 'Understand',
      uk: 'Зрозуміло',
      ru: 'Понятно',
    }),
  },
} satisfies Dictionary

export default profileContent
