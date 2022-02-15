import 'reflect-metadata'
import { createConnection } from 'typeorm'
import http from 'http'
import app from './app'

const port = process.env.PORT || 5000
const server = http.createServer(app)

createConnection()
  .then(async (connection) => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => console.log(error))
