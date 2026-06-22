import { graphql } from '~/shared/api/graphql'

export const UPDATE_USER_COLOR_MUTATION = graphql(`
  mutation UpdateUserColor($input: UpdateUserColorInput!) {
    updateUserColor(input: $input) {
      id
      email
      username
      color
    }
  }
`)
