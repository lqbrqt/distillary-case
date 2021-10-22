import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('test')
})

export const server = () => {
  app.listen(process.env.PORT || 4000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started at: http://localhost:${process.env.PORT}`)
  })
}
