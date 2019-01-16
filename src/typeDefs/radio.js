import { gql } from 'apollo-server-express'

export default gql`

  enum RadioType {
    FM
    ONLINE
  }

  enum OperationType {
    UPDATED
    DELETED
    CREATED
  }

  extend type Subscription {
    observeRadios: ObservableRadio!
  }

  extend type Query {
    listRadios(type: RadioType, page: Int, limit: Int): [Radio!]! 
    listRadiosWithFavourites(type: RadioType, page: Int, limit: Int): [Radio!]! @requireAuth(roles: [ADMIN, CLIENT])
    findRadioById(id: ID!): Radio
  }

  extend type Mutation {
    createFmRadio(input: FmRadioInput) : FmRadio @requireAuth(roles: [ADMIN])
    createOnlineRadio(input: OnlineRadioInput) : OnlineRadio @requireAuth(roles: [ADMIN])

    updateFmRadio(input: FmRadioInputUpdate) : FmRadio @requireAuth(roles: [ADMIN])
    updateOnlineRadio(input: OnlineRadioInputUpdate) : OnlineRadio @requireAuth(roles: [ADMIN])

    deleteRadio(id: ID!) : Radio! @requireAuth(roles: [ADMIN])
    addRadioToFavourites(id: ID!) : Boolean! @requireAuth(roles: [ADMIN, CLIENT])
    removeRadioFromFavourites(id: ID!) : Boolean! @requireAuth(roles: [ADMIN, CLIENT])
  }

  type ObservableRadio {
    operationType: OperationType!,
    radio: Radio!
  }

  interface Radio {
    id: ID!
    type: RadioType!
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    isFavourite: Boolean 
    createdAt: String
    updatedAt: String
  }

  type FmRadio implements Radio {
    id: ID!
    type: RadioType!
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    isFavourite: Boolean
    createdAt: String
    updatedAt: String
    frequency: String!
    city: String!
  }

  type OnlineRadio implements Radio {
    id: ID!
    type: RadioType!
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    isFavourite: Boolean
    categories: [String!]!
    createdAt: String
    updatedAt: String
  }

  input OnlineRadioInput {
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    categories: [String]
  }

  input FmRadioInput {
    name: String!
    streamUrl: String!
    imageUrl: String
    desc: String
    frequency: String!
    city: String!
  }

  input OnlineRadioInputUpdate {
    id: ID!
    name: String
    streamUrl: String
    imageUrl: String
    desc: String
    categories: [String!]
  }

  input FmRadioInputUpdate {
    id: ID!
    name: String
    streamUrl: String
    imageUrl: String
    desc: String
    frequency: String
    city: String
  }
`
