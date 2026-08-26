import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import productRouter from './routes/productRoutes.js'

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

app.use('/api/products', productRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
