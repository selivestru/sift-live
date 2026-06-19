import { IntlayerProvider } from 'react-intlayer'

import { useInitAuth } from '~/shared/auth'
import { Spinner } from '~/shared/ui/Spinner'

import { SocketProvider } from './SocketProvider'
import { TanstackRouter } from './TanstackRouter'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from './Toaster'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  const { isLoading } = useInitAuth()

  if (isLoading) {
    return <Spinner variant="full-fixed" />
  }

  return (
    <SocketProvider>
      <UrqlProvider>
        <IntlayerProvider>
          <ThemeProvider>
            <Toaster />
            <TanstackRouter />
          </ThemeProvider>
        </IntlayerProvider>
      </UrqlProvider>
    </SocketProvider>
  )
}
