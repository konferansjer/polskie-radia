import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import jwks from 'jwks-rsa'
import jwt from 'express-jwt'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import jwtAuth from './auth'
import RequireAuthDirective from './directives/auth'

function skipJwtError (err, req, res, next) {
  console.error(err)
  if (err) next()
}

(async () => {
  try {
    const {
      PORT = 3000,
      NODE_ENV = 'development',
      DB_USER,
      DB_HOST,
      DB_PASSWORD,
      DB_PORT,
      DB_NAME,
      AUTH0_DOMAIN,
      AUTH0_AUDIENCE,
      ENGINE_API_KEY
    } = process.env

    await mongoose.connect(
      `mongodb://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true }
    )

    const auth = jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`
      }),
      credentialsRequired: false,
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_DOMAIN,
      algorithms: ['RS256']
    })

    const app = express()

    app.disable('x-powered-by')
    app.use(bodyParser.json(), auth, skipJwtError)

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives: {
        requireAuth: RequireAuthDirective
      },
      playground: NODE_ENV !== 'production',
      context: jwtAuth,
      engine: {
        apiKey: ENGINE_API_KEY
      }
    })

    server.applyMiddleware({ app })
    app.listen({ port: PORT }, () => console.log(`http://localhost:${PORT}${server.graphqlPath}`))
  } catch (error) {
    console.error(error)
  }
})()
