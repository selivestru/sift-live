import { useIntlayer } from 'react-intlayer'

export const AccountPage = () => {
  const t = useIntlayer('profile')

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">{t.account}</h1>
    </div>
  )
}
