import { authExchange } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient, fetchExchange } from 'urql'
import z from 'zod'

import {
  FollowedChannelsDocument,
  type FollowChannelMutation,
  type UnFollowChannelMutation,
} from '~/shared/api/graphql/__generated__/graphql'
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
    cacheExchange({
      updates: {
        Mutation: {
          followChannel: (result: FollowChannelMutation, _, cache) => {
            cache.updateQuery({ query: FollowedChannelsDocument }, (data) => {
              if (!data) return null

              const alreadyExists = data.followedChannels.some(
                (channel) => channel.id === result.followChannel.id,
              )

              if (!alreadyExists) {
                data.followedChannels.push(result.followChannel)
              }

              return data
            })
          },
          unFollowChannel: (result: UnFollowChannelMutation, _, cache) => {
            cache.updateQuery({ query: FollowedChannelsDocument }, (data) => {
              if (!data || data.followedChannels.length === 0) return null

              data.followedChannels = data.followedChannels.filter(
                (channel) => channel.id !== result.unFollowChannel.id,
              )

              return data
            })
          },
        },
      },
    }),
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
