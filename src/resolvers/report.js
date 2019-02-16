import { Report, Radio, User } from '../models'
import mongoose from 'mongoose'
import { RadioReportedError, RadioNotFoundError } from '../errors'
import { UserInputError } from 'apollo-server-express'

export default {
  Mutation: {
    createReport: async (root, { input }, context, info) => {
      let userId = context.user._id
      let existingReport = await Report.findOne({ userId, radioId: input.radioId })
      if(existingReport) throw new RadioReportedError()
      
      if (!mongoose.Types.ObjectId.isValid(input.radioId)) {
        throw new UserInputError('Invalid radio id')
      }

      let radio = await Radio.findById(input.radioId)
      if(!radio) throw new RadioNotFoundError()

      input.status = 'NEW'
      input.userId = userId
      return Report.create(input)
    }
  },
  Query: {
    listReports: async (root, { status, radioId }, context, info) => {
      let params = {}
      if(status) params.status = status
      if(radioId) params.radioId = radioId
      return Report.find(params)
    }
  },
  Report: {
    radio: async (root, args, context, info) => {
      return Radio.findById(root.radioId)
    },
    user: async (root, args, context, info) => {
      return User.findById(root.userId)
    },
  }
}
