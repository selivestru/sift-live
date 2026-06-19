import { t, type Dictionary } from 'intlayer'

const chatBoxContent = {
  key: 'chat-box',
  content: {
    title: t({
      en: 'Stream Chat',
      uk: 'Чат стріму',
      ru: 'Чат стрима',
    }),
    inputPlaceholder: t({
      en: 'Send a message',
      uk: 'Надіслати повідомлення',
      ru: 'Отправить сообщение',
    }),
    chatDisabled: t({
      en: 'Sign in to chat',
      uk: 'Увійдіть, щоб писати в чат',
      ru: 'Войдите, чтобы писать в чат',
    }),
    welcomeMessage: t({
      en: 'Welcome to the chat! Be kind and respect the community rules.',
      uk: 'Ласкаво просимо до чату! Будьте добрими та поважайте правила спільноти.',
      ru: 'Добро пожаловать в чат! Будьте добры и уважайте правила сообщества.',
    }),
    signInButton: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
    connecting: t({
      en: 'Connecting…',
      uk: 'Підключення…',
      ru: 'Подключение…',
    }),
    messageDeleted: t({
      en: 'Message deleted',
      uk: 'Повідомлення видалено',
      ru: 'Сообщение удалено',
    }),
    banned: t({
      en: 'You are banned from this channel',
      uk: 'Вас заблоковано на цьому каналі',
      ru: 'Вы забанены на этом канале',
    }),
  },
} satisfies Dictionary

export default chatBoxContent
