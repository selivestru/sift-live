import { Provider } from 'urql'

import { client } from '~/shared/api/graphql'

export const UrqlProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider value={client}>{children}</Provider>
)
