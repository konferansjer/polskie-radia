import user from './user'
import radio from './radio'
import report from './report'

import { gql } from 'apollo-server-express'

const baseTypes = gql`
  directive @requireAuth(
    roles: [Role]
  ) on FIELD_DEFINITION
  
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }

  enum Role {
    ADMIN
    CLIENT
  }
`

export default [
  baseTypes,
  user,
  radio,
  report
]
