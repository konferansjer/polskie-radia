import { Radio, User } from '../models'
import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'

export default {
  Query: {
    listRadios: (root, args, context, info) => {
      return Radio.find({})
    },
    findRadioById: (root, { id }, context, info) => {
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
    deleteRadio: async (root, { id }, context, info) => {
      await Radio.find({ _id: id }).remove().exec()
      return true
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
    addRadioToFavourites: async (root, { id }, { user }, info) => {
      await User.update(
        { _id: user._id },
        { $addToSet: { favouriteRadios: [id] } }
      )
      return true
    },
    removeRadioFromFavourites: async (root, { id }, { user }, info) => {
      await User.update(
        { _id: user._id },
        { $pull: { favouriteRadios: id } }
      )
      return true
    }
  }
}
