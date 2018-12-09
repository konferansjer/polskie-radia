import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    radios: [Radio!]!
  }

  extend type Mutation {
    createRadio(name: String!, streamUrl: String!, imageUrl: String, desc: String ) : Radio
    updateRadio(id: String!, name: String, streamUrl: String, imageUrl: String, desc: String ) : Radio
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
