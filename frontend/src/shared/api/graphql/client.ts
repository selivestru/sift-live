import { authExchange } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient, fetchExchange } from 'urql'
import z from 'zod'

import { REFRESH_MUTATION } from '~/shared/auth/api/refresh'
import { useAuthStore } from '~/shared/auth/auth.store'
import { env } from '~/shared/config/env'
import { ACCESS_TOKEN_KEY, getStorageItem, setStorageItem } from '~/shared/lib/storage'

export const client = createClient({
  url: `${env.VITE_API_URL}/graphql`,
  fetchOptions: {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  },
  exchanges: [
    cacheExchange(),
    authExchange(async (utils) => {
      return {
        addAuthToOperation(operation) {
          const token = getStorageItem(ACCESS_TOKEN_KEY, z.string().nullable(), null)

          if (!token) return operation

          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          })
        },

        didAuthError(error) {
          const shouldSkipAuthError = error.graphQLErrors.some(
            (e) =>
              Array.isArray(e.path) && (e.path.includes('logout') || e.path.includes('refresh')),
          )

          if (shouldSkipAuthError) {
            return false
          }

          return (
            error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED') ||
            error.response?.status === 401
          )
        },

        async refreshAuth() {
          let token = getStorageItem(ACCESS_TOKEN_KEY, z.string().nullable(), null)

          const result = await utils.mutate(REFRESH_MUTATION, {})

          if (result.data?.refresh?.accessToken) {
            token = result.data.refresh.accessToken
            setStorageItem('accessToken', token)
            useAuthStore.getState().setToken(token!)
          } else {
            useAuthStore.getState().logout()
          }
        },
      }
    }),
    fetchExchange,
  ],
})
