import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'

const app = express()

await connectDB()

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(",").map((item) => item.trim()))

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:5173"
]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  }
}))
app.use(express.json())

app.get('/', (req, res) => res.send("API is Working"))
app.get('/health', (req, res) => res.json({ success: true, message: "API is healthy" }))

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)   // ✅ fixed (not b)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`😈 Server running at ${PORT}`)
})


