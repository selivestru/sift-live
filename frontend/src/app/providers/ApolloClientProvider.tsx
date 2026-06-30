import { ApolloProvider } from '@apollo/client/react'

import { client } from '~/shared/api/graphql'

export const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)
