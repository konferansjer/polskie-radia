import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'

const {
  AUTH0_AUDIENCE
} = process.env

function setClaims (user) {
  user.userId = user[AUTH0_AUDIENCE + '/user_id']
  user.role = user[AUTH0_AUDIENCE + '/role']
  return user
}

const auth = async ({ req }) => {
  try {
    if (!req.user) return {}
    let extUser = setClaims(req.user)
    const user = await User.findOneAndUpdate(
      { userId: extUser.userId },
      { userId: extUser.userId },
      { new: true, upsert: true, runValidators: true }
    )
    user.role = extUser.role
    return { user }
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}

export default auth
