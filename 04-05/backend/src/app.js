import cors from 'cors'
import express from 'express'

const app = express()
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.disable('x-powered-by')
app.use(
  cors({
    origin: corsOrigin,
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

export default app

