import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  type: String,
  status: {
    type: String,
    enum: ['NEW', 'FINISHED'],
    required: true
  },
  userId: String,
  radioId: String  
}, {
  timestamps: true
})

export default mongoose.model('Report', reportSchema)
