import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [User!]!
    me: User
  }

  extend type Mutation {
    signUp(email: String!, password: String!) : User
  }

  type User {
    id: ID!
    favourites: [Radio!]!
    createdAt: String!
    updatedAt: String!
  }
`
