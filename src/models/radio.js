import mongoose from 'mongoose'

const radioSchema = new mongoose.Schema({
  name: String,
  streamUrl: String,
  imageUrl: String,
  desc: String
}, {
  timestamps: true
})

export default mongoose.model('Radio', radioSchema)
