import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    listUsers: [User!]! @requireAuth(roles: [admin])
    findUserById(id: ID!): User @requireAuth(roles: [admin])
    me: User @requireAuth(roles: [client])
  }

  type User {
    id: ID!
    favouriteRadios: [Radio!]!
    createdAt: String!
    updatedAt: String!
  }
`
