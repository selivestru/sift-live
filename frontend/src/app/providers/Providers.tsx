import { TanstackRouter } from './TanstackRouter'
import { ThemeProvider } from './ThemeProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  return (
    <UrqlProvider>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TanstackRouter />
      </ThemeProvider>
    </UrqlProvider>
  )
}
