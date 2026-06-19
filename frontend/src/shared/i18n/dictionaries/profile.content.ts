import { t, type Dictionary } from 'intlayer'

const profileContent = {
  key: 'profile',
  content: {
    account: {
      title: t({ en: 'Account', uk: 'Акаунт', ru: 'Аккаунт' }),
      description: t({
        en: 'Manage your account information and preferences.',
        uk: 'Керуйте інформацією про акаунт та налаштуваннями.',
        ru: 'Управляйте информацией об аккаунте и настройками.',
      }),
      email: t({ en: 'Email', uk: 'Електронна пошта', ru: 'Электронная почта' }),
      username: t({ en: 'Username', uk: "Ім'я користувача", ru: 'Имя пользователя' }),
      displayName: t({ en: 'Display name', uk: 'Відображуване імʼя', ru: 'Отображаемое имя' }),
      bio: t({ en: 'Bio', uk: 'Про себе', ru: 'О себе' }),
      save: t({ en: 'Save changes', uk: 'Зберегти зміни', ru: 'Сохранить изменения' }),
      saved: t({ en: 'Saved (mock)', uk: 'Збережено (мок)', ru: 'Сохранено (мок)' }),
    },
    channel: {
      title: t({ en: 'Channel', uk: 'Канал', ru: 'Канал' }),
      description: t({
        en: 'Configure how your channel appears to viewers.',
        uk: 'Налаштуйте, як ваш канал виглядає для глядачів.',
        ru: 'Настройте, как ваш канал выглядит для зрителей.',
      }),
      channelName: t({ en: 'Channel name', uk: 'Назва каналу', ru: 'Название канала' }),
      channelDescription: t({
        en: 'Channel description',
        uk: 'Опис каналу',
        ru: 'Описание канала',
      }),
      save: t({ en: 'Save changes', uk: 'Зберегти зміни', ru: 'Сохранить изменения' }),
    },
    streamSettings: {
      title: t({ en: 'Stream settings', uk: 'Налаштування стріму', ru: 'Настройки стрима' }),
      description: t({
        en: 'Configure stream quality, latency, and ingestion.',
        uk: 'Налаштуйте якість, затримку та інгестію стріму.',
        ru: 'Настройте качество, задержку и ингестию стрима.',
      }),
      streamKey: t({ en: 'Stream key', uk: 'Ключ стріму', ru: 'Ключ стрима' }),
      streamKeyHint: t({
        en: 'Keep this private. Anyone with the key can stream to your channel.',
        uk: 'Бережіть це в таємниці. Будь-хто з ключем може стрімити на ваш канал.',
        ru: 'Храните это в тайне. Любой с ключом может стримить на ваш канал.',
      }),
      ingestServer: t({ en: 'Ingest server', uk: 'Сервер інгестії', ru: 'Сервер ингестии' }),
      streamQuality: t({ en: 'Stream quality', uk: 'Якість стріму', ru: 'Качество стрима' }),
      copyKey: t({ en: 'Copy', uk: 'Копіювати', ru: 'Копировать' }),
      copied: t({ en: 'Copied (mock)', uk: 'Скопійовано (мок)', ru: 'Скопировано (мок)' }),
    },
    notifications: {
      title: t({ en: 'Notifications', uk: 'Сповіщення', ru: 'Уведомления' }),
      description: t({
        en: 'Choose what you want to be notified about.',
        uk: 'Оберіть, про що ви хочете отримувати сповіщення.',
        ru: 'Выберите, о чем вы хотите получать уведомления.',
      }),
      followedLive: t({
        en: 'A followed channel goes live',
        uk: 'Відстежуваний канал починає ефір',
        ru: 'Отслеживаемый канал начинает эфир',
      }),
      newFollower: t({
        en: 'You get a new follower',
        uk: 'У вас новий підписник',
        ru: 'У вас новый подписчик',
      }),
      mentions: t({
        en: 'You are mentioned in chat',
        uk: 'Вас згадали в чаті',
        ru: 'Вас упомянули в чате',
      }),
      weeklyDigest: t({
        en: 'Weekly digest email',
        uk: 'Щотижневий дайджест',
        ru: 'Еженедельный дайджест',
      }),
      save: t({ en: 'Save preferences', uk: 'Зберегти налаштування', ru: 'Сохранить настройки' }),
    },
    security: {
      title: t({ en: 'Security', uk: 'Безпека', ru: 'Безопасность' }),
      description: t({
        en: 'Keep your account secure with a strong password and 2FA.',
        uk: 'Захистіть акаунт надійним паролем та 2FA.',
        ru: 'Защитите аккаунт надежным паролем и 2FA.',
      }),
      changePassword: t({ en: 'Change password', uk: 'Змінити пароль', ru: 'Изменить пароль' }),
      twoFactor: t({
        en: 'Two-factor authentication',
        uk: 'Двофакторна автентифікація',
        ru: 'Двухфакторная аутентификация',
      }),
      twoFactorDescription: t({
        en: 'Add an extra layer of security to your account.',
        uk: 'Додайте додатковий рівень безпеки для акаунту.',
        ru: 'Добавьте дополнительный уровень безопасности для аккаунта.',
      }),
      enable: t({ en: 'Enable', uk: 'Увімкнути', ru: 'Включить' }),
      enabled: t({ en: 'Enabled', uk: 'Увімкнено', ru: 'Включено' }),
    },
  },
} satisfies Dictionary

export default profileContent
