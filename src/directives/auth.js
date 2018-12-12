import {
  SchemaDirectiveVisitor,
  AuthenticationError
} from 'apollo-server'

import { AuthorizationError } from '../errors'

export default class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve } = field
    const { roles } = this.args
    field.resolve = async function (...args) {
      const [, , ctx] = args
      if (ctx.user) {
        if (roles && (!roles.includes(ctx.user.role))) {
          throw new AuthorizationError(
            'You are not authorized to view this resource.'
          )
        } else {
          const result = await resolve.apply(this, args)
          return result
        }
      } else {
        throw new AuthenticationError(
          'You must be signed in to view this resource.'
        )
      }
    }
  }
}
