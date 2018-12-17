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
  Radio: {
    __resolveType(radio) {
      switch (radio.type) {
        case 'FM': return 'FmRadio'
        case 'ONLINE': return 'OnlineRadio'
      }
    }
  },
  Mutation: {
    createFmRadio: (root, { input }, context, info) => {
      input.type = 'FM'
      return Radio.create(input)
    },
    createOnlineRadio: (root, { input }, context, info) => {
      input.type = 'ONLINE'
      return Radio.create(input)
    },
    updateFmRadio: (root, { input: { id, ...args } }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        return radio
      })
    },
    updateOnlineRadio: (root, { input: { id, ...args } }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        return radio
      })
    },
    deleteRadio: async (root, { id }, context, info) => {
      await Radio.remove({ _id: id })
      return true
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
