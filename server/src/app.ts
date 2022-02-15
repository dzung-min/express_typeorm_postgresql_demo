import express from 'express'
import morgan from 'morgan'

import usersRouter from './routers/users'
import errorHandlers from './middlewares/errorHandlers'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/users', usersRouter)

app.use(errorHandlers.notFound)
app.use(errorHandlers.generic)

export default app
