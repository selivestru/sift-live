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
  },
} satisfies Dictionary

export default profileContent
