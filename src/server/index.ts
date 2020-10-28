import * as express from 'express'

const port = process.env.PORT || 3103
const app = express()

app.use(express.static('static', {}))

const startListening = async () => {
  app.listen(port, async () => {
    console.log(`Listening on port ${port}`)
  })
}

startListening().catch(err => console.error(err))
