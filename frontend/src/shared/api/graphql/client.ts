import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable } from '@apollo/client'
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import z from 'zod'

import { useAuthStore } from '~/shared/auth/auth.store'
import { env } from '~/shared/config/env'
import { ACCESS_TOKEN_KEY, getStorageItem, setStorageItem } from '~/shared/lib/storage'

const REFRESH_OPERATION = `mutation Refresh { refresh { accessToken } }`

const httpLink = new HttpLink({
  uri: `${env.VITE_API_URL}/graphql`,
  credentials: 'include',
})

const authLink = new SetContextLink(({ headers }) => {
  const token = getStorageItem(ACCESS_TOKEN_KEY, z.string().nullable(), null)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const isUnauthenticated = (error: Error) =>
  (CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.['code'] === 'UNAUTHENTICATED')) ||
  (ServerError.is(error) && error.statusCode === 401)

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!isUnauthenticated(error)) return

  if (operation.operationName === 'Logout' || operation.operationName === 'Refresh') return

  return new Observable((observer) => {
    const currentToken = getStorageItem(ACCESS_TOKEN_KEY, z.string().nullable(), null)

    fetch(`${env.VITE_API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ query: REFRESH_OPERATION }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newToken = result?.data?.refresh?.accessToken

        if (newToken) {
          setStorageItem(ACCESS_TOKEN_KEY, newToken)
          useAuthStore.getState().setToken(newToken)

          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }))

          forward(operation).subscribe(observer)
        } else {
          useAuthStore.getState().logout()
          observer.complete()
        }
      })
      .catch(() => {
        useAuthStore.getState().logout()
        observer.complete()
      })
  })
})

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          followedChannels: {
            merge(_, incoming) {
              return incoming
            },
          },
          liveChannels: {
            merge(_, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
