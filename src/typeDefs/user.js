import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    listUsers: [User!]! @requireAuth(roles: [ADMIN])
    findUserById(id: ID!): User @requireAuth(roles: [ADMIN])
    me: User @requireAuth(roles: [CLIENT])
  }

  type User {
    id: ID!
    favouriteRadios: [Radio!]!
    createdAt: String!
    updatedAt: String!
  }
`
