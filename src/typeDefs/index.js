import user from './user'
import radio from './radio'
import { gql } from 'apollo-server-express'

const baseTypes = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`

export default [
  baseTypes,
  user,
  radio
]
