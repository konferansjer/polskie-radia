import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    radios: [Radio!]!
    radio(id: String!): Radio
  }

  extend type Mutation {
    createRadio(name: String!, streamUrl: String!, imageUrl: String, desc: String ) : Radio
    updateRadio(id: String!, name: String, streamUrl: String, imageUrl: String, desc: String ) : Radio
    addToFavourites(radioId: String!) : Boolean!
    removeFromFavourites(radioId: String!) : Boolean!
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
`
