import { User } from '../models'

export default {
  Query: {
    users: (root, args, context, info) => {
      return User.find({})
    },
    me: (root, args, { user }, info) => {
      return User.findById(user._id)
    }
  },
  User: {
    favourites: async (user) => {
      const result = await User.findById(user).populate('favourites').exec()
      return result.favourites
    }
  }
}
