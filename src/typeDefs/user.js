import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [User!]!
    me: User
  }

  extend type Mutation {
    signUp(email: String!) : User
  }

  type User {
    id: ID!
    email: String!
  }
`
