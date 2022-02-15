import { ErrorRequestHandler, RequestHandler } from 'express'
import httpErrors from 'http-errors'

const notFound: RequestHandler = (req, res, next) => {
  next(new httpErrors.NotFound('Not found'))
}

const generic: ErrorRequestHandler = (err, req, res, next) => {
  const errCode = err.statusCode || 500
  const message = err.message || 'Something went wrong'
  res.status(errCode).json({ error: { message } })
}

export default { notFound, generic }
