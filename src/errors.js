import { createError } from 'apollo-errors'

export const AuthorizationError = createError('AuthorizationError', {
  message: 'You are not authorized.',
  code: 'UNAUTHORIZED'
})

export const RadioReportedError = createError('RadioReportedError', {
  message: 'You already reported this radio station.',
  code: 'RADIO_ALREADY_REPORTED'
})

export const RadioNotFoundError = createError('RadioNotFoundError', {
  message: 'Radio not found.',
  code: 'RADIO_NOT_FOUND'
}) 