import 'reflect-metadata'
import { createConnection } from 'typeorm'
import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const { PORT, DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } =
  process.env
const server = http.createServer(app)

createConnection({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
})
  .then(async (connection) => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error))
