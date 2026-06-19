import { t, type Dictionary } from 'intlayer'

const mainLayoutContent = {
  key: 'main-layout',
  content: {
    followedChannels: t({
      en: 'Followed Channels',
      uk: 'Відстежувані канали',
      ru: 'Отслеживаемые каналы',
    }),
    live: t({
      en: 'Live',
      uk: 'В ефірі',
      ru: 'В эфире',
    }),
    offline: t({
      en: 'Offline',
      uk: 'Не в ефірі',
      ru: 'Не в эфире',
    }),
    noFollowed: t({
      en: 'You are not following anyone yet',
      uk: 'Ви ще ні на кого не підписані',
      ru: 'Вы еще ни на кого не подписаны',
    }),
    viewers: t({
      en: 'viewers',
      uk: 'глядачів',
      ru: 'зрителей',
    }),
    activeChannels: t({
      en: 'Active Channels',
      uk: 'Активні канали',
      ru: 'Активные каналы',
    }),
    noActiveChannels: t({
      en: 'No active streams right now',
      uk: 'Зараз немає активних трансляцій',
      ru: 'Сейчас нет активных трансляций',
    }),
  },
} satisfies Dictionary

export default mainLayoutContent
