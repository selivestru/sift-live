import { t, type Dictionary } from 'intlayer'

const channelPageContent = {
  key: 'channel-page',
  content: {
    channel: {
      notFound: t({
        en: 'Channel not found',
        uk: 'Канал не знайдено',
        ru: 'Канал не найден',
      }),
    },
    category: t({
      en: 'Category',
      uk: 'Категорія',
      ru: 'Категория',
    }),
    viewers: t({
      en: 'viewers',
      uk: 'глядачів',
      ru: 'зрителей',
    }),
    followers: t({
      en: 'followers',
      uk: 'підписників',
      ru: 'подписчиков',
    }),
    follow: t({
      en: 'Follow',
      uk: 'Підписатися',
      ru: 'Подписаться',
    }),
    following: t({
      en: 'Following',
      uk: 'Ви підписані',
      ru: 'Вы подписаны',
    }),
    followError: t({
      en: 'Failed to follow channel',
      uk: 'Не вдалося підписатися на канал',
      ru: 'Не удалось подписаться на канал',
    }),
    unfollowError: t({
      en: 'Failed to unfollow channel',
      uk: 'Не вдалося відписатися від каналу',
      ru: 'Не удалось отписаться от канала',
    }),
    offline: t({
      en: 'This channel is currently offline',
      uk: 'Цей канал зараз не в ефірі',
      ru: 'Этот канал сейчас не в эфире',
    }),
    tabs: {
      description: t({
        en: 'Description',
        uk: 'Опис',
        ru: 'Описание',
      }),
      clips: t({
        en: 'Clips',
        uk: 'Кліпи',
        ru: 'Клипы',
      }),
      videos: t({
        en: 'Videos',
        uk: 'Відео',
        ru: 'Видео',
      }),
    },
    verified: t({
      en: 'Verified channel',
      uk: 'Верефікований канал',
      ru: 'Подтверждённый канал',
    }),
    info: t({
      en: 'Info',
      uk: 'Інформація',
      ru: 'Информация',
    }),
    views: t({
      en: 'views',
      uk: 'переглядів',
      ru: 'просмотров',
    }),
    noClips: t({
      en: 'No clips yet',
      uk: 'Кліпів ще немає',
      ru: 'Клипов пока нет',
    }),
    noVideos: t({
      en: 'No videos yet',
      uk: 'Відео ще немає',
      ru: 'Видео пока нет',
    }),
  },
} satisfies Dictionary

export default channelPageContent
