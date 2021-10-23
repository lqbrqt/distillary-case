import express, { json } from 'express'
import cors from 'cors'
import { EXPRESS_PORT } from './config'

import questionRouter from './routes/question-route'
import testRouter from './routes/test-route'

const app = express()

app.use(json())

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true)
  },
}

app.use(cors(corsOptions))

app.use(questionRouter)
app.use(testRouter)

app.get('/', (req, res) => {
  res.send('test')
})

export const server = () => {
  app.listen(EXPRESS_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started at: http://localhost:${EXPRESS_PORT}`)
  })
}

//server()