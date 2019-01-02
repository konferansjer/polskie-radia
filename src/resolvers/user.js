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
    me: (root, args, context, info) => {
      let fields = info.operation.selectionSet.selections[0].selectionSet.selections.map(selection => selection.name.value)
      if (fields.includes('favouriteRadios')) {
        return User.findById(context.user._id).populate('favouriteRadios').exec()
      } else {
        return context.user
      }
    }
  }
}
