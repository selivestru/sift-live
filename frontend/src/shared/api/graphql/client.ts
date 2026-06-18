import { authExchange } from '@urql/exchange-auth'
import { cacheExchange, createClient, fetchExchange } from 'urql'

export const client = createClient({
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    headers: {
      'content-type': 'application/json',
    },
  },
  exchanges: [
    cacheExchange,
    authExchange(async (utils) => {
      let token: string | null = localStorage.getItem('accessToken')

      return {
        addAuthToOperation(operation) {
          if (!token) return operation

          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          })
        },
        didAuthError(error) {
          return error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
        },
        async refreshAuth() {},
      }
    }),
    fetchExchange,
  ],
})
