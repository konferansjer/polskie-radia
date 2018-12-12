import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'

const {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE
} = process.env

const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
})

const options = {
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}

function getKey (header, cb) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return cb(err)
    var signingKey = key.publicKey || key.rsaPublicKey
    cb(null, signingKey)
  })
}

function mapClaims (user) {
  user.userId = user[AUTH0_AUDIENCE + '/user_id']
  user.role = user[AUTH0_AUDIENCE + '/role']
  return user
}

const auth = async ({ req }) => {
  try {
    if (!req.headers.authorization) return {}
    const [bearer, token] = req.headers.authorization.split(' ')
    if (bearer !== 'Bearer') throw new AuthenticationError('Invalid authorization schema: Bearer #token')
    if (!token) return {}
    const extUser = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if (err) {
          return reject(err)
        }
        resolve(decoded)
      })
    })
    mapClaims(extUser)

    const contextUser = await User.findOneAndUpdate(
      { userId: extUser.userId },
      { userId: extUser.userId },
      { new: true, upsert: true, runValidators: true }
    )
    contextUser.role = extUser.role
    return { user: contextUser }
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}

export default auth
