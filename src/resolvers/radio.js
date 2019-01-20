import { Radio, User } from '../models'
import mongoose from 'mongoose'
import { UserInputError, PubSub, withFilter } from 'apollo-server-express'

const pubsub = new PubSub()

const OBSERVE_RADIO = 'OBSERVE_RADIO'
export default {
  Subscription: {
    observeRadios: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([OBSERVE_RADIO]),
        (payload, variables) => {
          return payload.observeRadios.radio.region === variables.region
        }
      )
    }
  },
  Query: {
    listRadios: (root, { page = 0, limit = 25, type }, { region }, info) => {
      let params = {}
      if (type) params.type = type
      if (region) params.region = region
      return Radio.find(params).skip(page * limit).limit(limit)
    },
    listRadiosWithFavourites: async (root, { page = 0, limit = 25, type }, { region, user }, info) => {
      let params = {}
      if (type) params.type = type
      if (region) params.region = region
      return Radio.aggregate([
        {
          '$match': params
        },
        {
          '$addFields': {
            'isFavourite': {
              '$in': ['$_id', user.favouriteRadios]
            }
          }
        }
      ])
        .sort('-isFavourite')
        .skip(page * limit)
        .limit(limit)
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
        default: return null
      }
    }
  },
  FmRadio: {
    id: (root, args, context, info) => {
      return root._id.toString()
    }
  },
  OnlineRadio: {
    id: (root, args, context, info) => {
      return root._id.toString()
    }
  },
  Mutation: {
    createFmRadio: async (root, { input }, context, info) => {
      input.type = 'FM'
      let radio = await Radio.create(input)
      pubsub.publish(OBSERVE_RADIO, {
        observeRadios: {
          radio,
          operationType: 'CREATED'
        }
      })
      return radio
    },
    createOnlineRadio: async (root, { input }, context, info) => {
      input.type = 'ONLINE'
      let radio = await Radio.create(input)
      pubsub.publish(OBSERVE_RADIO, {
        observeRadios: {
          radio,
          operationType: 'CREATED'
        }
      })
      return radio
    },
    updateFmRadio: (root, { input: { id, ...args } }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        pubsub.publish(OBSERVE_RADIO, {
          observeRadios: {
            radio,
            operationType: 'UPDATED'
          }
        })
        return radio
      })
    },
    updateOnlineRadio: (root, { input: { id, ...args } }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Invalid id')
      }
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        pubsub.publish(OBSERVE_RADIO, {
          observeRadios: {
            radio,
            operationType: 'UPDATED'
          }
        })
        return radio
      })
    },
    deleteRadio: async (root, { id }, context, info) => {
      let radio = await Radio.findOneAndRemove({ _id: id })
      pubsub.publish(OBSERVE_RADIO, {
        observeRadios: {
          radio,
          operationType: 'DELETED'
        }
      })
      return radio
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
