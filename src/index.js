import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import mongoose from 'mongoose'
import auth from './auth'

(async () => {
  try {
    const {
      APP_PORT = 3000,
      NODE_ENV = 'development',
      DB_USER,
      DB_HOST,
      DB_PASSWORD,
      DB_PORT,
      DB_NAME
    } = process.env

    await mongoose.connect(
      `mongodb://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true }
    )

    const app = express()
    app.disable('x-powered-by')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: NODE_ENV !== 'production',
      context: auth
    })

    server.applyMiddleware({ app })
    app.listen({ port: APP_PORT }, () => console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`))
  } catch (error) {
    console.log(error)
  }
})()
