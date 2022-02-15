import { validate } from 'class-validator'
import httpErrors from 'http-errors'
import bcrypt from 'bcrypt'
import { RequestHandler } from 'express'

import { User } from '../entity/User'
import getErrorMessage from '../utils/getValidationErrorMessage'

export const list: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({ deleted: false })
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const create: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new httpErrors.Conflict('Email already exist'))
    }
    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    const errors = await validate(user)
    if (errors.length > 0) {
      return next(new httpErrors.BadRequest(getErrorMessage(errors)))
    }
    user.password = await bcrypt.hash(password, 10)
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const getById: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIds([req.params.id])
    if (user.length === 0 || user[0].deleted === true) {
      return next(new httpErrors.NotFound('User not found'))
    }
    // @ts-ignore
    req.user = user[0]
    next()
  } catch (error) {
    next(error)
  }
}

export const read: RequestHandler = (req, res, next) => {
  // @ts-ignore
  res.json(req.user)
}

export const update: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body
  // @ts-ignore
  const { user } = req
  try {
    if (email && user.email !== email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return next(new httpErrors.Conflict('Email already exist'))
      }
    }
    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        user.password = password
      }
    }
    const errors = await validate(user)
    if (errors.length > 0) {
      return next(new httpErrors.BadRequest(getErrorMessage(errors)))
    }
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const destroy: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const { user } = req
  try {
    user.deleted = true
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
}
