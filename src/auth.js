import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'

const {
  AUTH0_AUDIENCE
} = process.env

function setClaims(user) {
  user.userId = user[AUTH0_AUDIENCE + '/user_id']
  user.role = user[AUTH0_AUDIENCE + '/role']
  return user
}

const auth = async (jwtUser) => {
  try {
    if (!jwtUser) return null
    jwtUser = setClaims(jwtUser)
    let user = await User.findOneAndUpdate(
      { userId: jwtUser.userId },
      { userId: jwtUser.userId },
      { new: true, upsert: true, runValidators: true }
    )
    user.role = jwtUser.role
    return user
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}

export default auth
