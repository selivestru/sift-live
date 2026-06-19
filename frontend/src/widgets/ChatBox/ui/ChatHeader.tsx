import { useIntlayer } from 'react-intlayer'

export const ChatHeader = () => {
  const t = useIntlayer('chat-box')

  return (
    <div className="flex justify-center border-b px-4 py-3">
      <h2 className="text-sm font-semibold">{t.title.value}</h2>
    </div>
  )
}
