import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'urql'

import { graphql } from '~/shared/api/graphql'

const PUBLIC_QUERY = graphql(`
  query Public {
    public
  }
`)

const RouteComponent = () => {
  const [result] = useQuery({ query: PUBLIC_QUERY })

  if (result.fetching) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>

  return <div>{result.data?.public}</div>
}

export const Route = createFileRoute('/')({
  component: RouteComponent,
})
