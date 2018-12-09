import { User } from '../models'

export default {
  Query: {
    users: (root, args, context, info) => {
      return User.find({})
    },
    me: (root, args, context, info) => {
    }
  },
  Mutation: {
    signUp: (root, args, context, info) => {

    }
  }
}
