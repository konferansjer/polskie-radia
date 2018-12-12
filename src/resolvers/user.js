import { User } from '../models'
import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'

export default {
  Query: {
    listUsers: (root, args, context, info) => {
      return User.find({})
    },
    findUserById: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return User.findById(id)
    },
    me: (root, args, { user }, info) => {
      return User.findById(user._id)
    }
  },
  User: {
    favouriteRadios: async (user) => {
      const result = await User.findById(user).populate('favouriteRadios').exec()
      return result.favouriteRadios
    }
  }
}
