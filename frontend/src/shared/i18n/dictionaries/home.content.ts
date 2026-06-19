import { t, type Dictionary } from 'intlayer'

const homeContent = {
  key: 'home',
  content: {
    recommendedForYou: t({
      en: 'Recommended for you',
      uk: 'Рекомендовані для вас',
      ru: 'Рекомендуем для вас',
    }),
    refresh: t({
      en: 'Refresh',
      uk: 'Оновити',
      ru: 'Обновить',
    }),
    live: t({
      en: 'Live',
      uk: 'В ефірі',
      ru: 'В эфире',
    }),
    viewers: t({
      en: 'viewers',
      uk: 'глядачів',
      ru: 'зрителей',
    }),
    noResults: t({
      en: 'No streams match your filters',
      uk: 'Жоден стрім не відповідає фільтрам',
      ru: 'Ни один стрим не подходит под фильтры',
    }),
    browseChannels: t({
      en: 'Browse all channels',
      uk: 'Переглянути всі канали',
      ru: 'Смотреть все каналы',
    }),
  },
} satisfies Dictionary

export default homeContent
