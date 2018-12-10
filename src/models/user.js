import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  favourites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Radio'
  }],
  userId: String
}, {
  timestamps: true
})

export default mongoose.model('User', userSchema)
