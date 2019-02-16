import { gql } from 'apollo-server-express'

export default gql`
  enum ReportStatus {
    NEW
    FINISHED
  }

  extend type Mutation {
    createReport(input: ReportInput): Report @requireAuth(roles: [ CLIENT, ADMIN ])
  }

  extend type Query {
    listReports(status: ReportStatus, radioId: ID): [Report]! @requireAuth(roles: [ ADMIN ])
  }

  input ReportInput {
    type: String!
    radioId: ID!
  }

  type Report {
    id: ID!
    userId: ID!
    radioId: ID!
    type: String!
    status: String!
    radio: Radio!
    user: User!
  }
`