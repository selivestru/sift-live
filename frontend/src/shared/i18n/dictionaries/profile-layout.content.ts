import { t, type Dictionary } from 'intlayer'

const profileLayoutContent = {
  key: 'profile-layout',
  content: {
    settings: t({
      en: 'Settings',
      uk: 'Налаштування',
      ru: 'Настройки',
    }),
    account: t({
      en: 'Account',
      uk: 'Акаунт',
      ru: 'Аккаунт',
    }),
    channel: t({
      en: 'Channel',
      uk: 'Канал',
      ru: 'Канал',
    }),
    streamSettings: t({
      en: 'Stream settings',
      uk: 'Налаштування стріму',
      ru: 'Настройки стрима',
    }),
    notifications: t({
      en: 'Notifications',
      uk: 'Сповіщення',
      ru: 'Уведомления',
    }),
    security: t({
      en: 'Security',
      uk: 'Безпека',
      ru: 'Безопасность',
    }),
  },
} satisfies Dictionary

export default profileLayoutContent
