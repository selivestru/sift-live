import { IntlayerProvider } from 'react-intlayer'

import { useInitAuth } from '~/shared/auth'
import { Spinner } from '~/shared/ui/Spinner'

import { ApolloClientProvider } from './ApolloClientProvider'
import { SocketProvider } from './SocketProvider'
import { TanstackRouter } from './TanstackRouter'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from './Toaster'

export const Providers = () => {
  const { isLoading } = useInitAuth()

  if (isLoading) {
    return <Spinner variant="full-fixed" />
  }

  return (
    <SocketProvider>
      <ApolloClientProvider>
        <IntlayerProvider>
          <ThemeProvider>
            <Toaster />
            <TanstackRouter />
          </ThemeProvider>
        </IntlayerProvider>
      </ApolloClientProvider>
    </SocketProvider>
  )
}
