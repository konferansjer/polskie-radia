import { Radio, User } from '../models'
import mongoose from 'mongoose'
import { UserInputError, AuthenticationError } from 'apollo-server-express'

export default {
  Query: {
    radios: (root, args, context, info) => {
      return Radio.find({})
    },
    radio: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findById(id)
    }
  },
  Mutation: {
    createRadio: (root, args, context, info) => {
      return Radio.create(args)
    },
    updateRadio: (root, { id, ...args }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        return radio
      })
    },
    addToFavourites: async (root, { radioId }, { user }, info) => {
      if (!user) throw new AuthenticationError('Unauthorized')
      await User.update(
        { _id: user._id },
        { $addToSet: { favourites: [radioId] } }
      )
      return true
    },
    removeFromFavourites: async (root, { radioId }, { user }, info) => {
      if (!user) throw new AuthenticationError('Unauthorized')
      await User.update(
        { _id: user._id },
        { $pull: { favourites: radioId } }
      )
      return true
    }
  }
}
