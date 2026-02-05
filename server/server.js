import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'

const app = express()

await connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send("API is Working"))

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)   // ✅ fixed (not b)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`😈 Server running at ${PORT}`)
})


