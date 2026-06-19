import { t, type Dictionary } from 'intlayer'

const streamPlayerContent = {
  key: 'stream-player',
  content: {
    placeholder: t({
      en: 'Stream player placeholder',
      uk: 'Плейер-заглушка стріму',
      ru: 'Плеер-заглушка стрима',
    }),
  },
} satisfies Dictionary

export default streamPlayerContent
