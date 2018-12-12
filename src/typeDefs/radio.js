import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    listRadios: [Radio!]! 
    findRadioById(id: ID!): Radio
  }

  extend type Mutation {
    createRadio(input: RadioInput) : Radio @requireAuth(roles: [admin])
    updateRadio(input: RadioInputUpdate) : Radio @requireAuth(roles: [admin])
    deleteRadio(id: ID!) : Boolean @requireAuth(roles: [admin])
    addRadioToFavourites(id: ID!) : Boolean! @requireAuth(roles: [admin, client])
    removeRadioFromFavourites(id: ID!) : Boolean! @requireAuth(roles: [admin, client])
  }

  type Radio {
    id: ID!
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    createdAt: String!
    updatedAt: String!
  }

  input RadioInput {
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
  }

  input RadioInputUpdate {
    id: ID!
    name: String
    streamUrl: String
    imageUrl: String
    desc: String
  }
`
