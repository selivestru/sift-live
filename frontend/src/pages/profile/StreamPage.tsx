import { useIntlayer } from 'react-intlayer'

export const StreamPage = () => {
  const t = useIntlayer('profile')

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">{t.stream}</h1>
    </div>
  )
}
