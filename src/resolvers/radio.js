import { Radio } from '../models'

export default {
  Query: {
    radios: (root, args, context, info) => {
      return Radio.find({})
    }
  },
  Mutation: {
    createRadio: (root, args, context, info) => {
      return Radio.create(args)
    },
    updateRadio: (root, { id, ...args }, context, info) => {
      return Radio.findByIdAndUpdate(id, { $set: args }, { new: true }, (err, radio) => {
        if (err) return err
        console.log(radio)
        return radio
      })
    }
  }
}
