import mongoose from 'mongoose'

const radioSchema = new mongoose.Schema({
  name: String,
  streamUrl: String,
  imageUrl: String,
  desc: String,
  frequency: String,
  city: String,
  categories: Array,
  type: {
    type: String,
    enum: ['FM', 'ONLINE'],
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Radio', radioSchema)
