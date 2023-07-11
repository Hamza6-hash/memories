import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import { fileURLToPath } from "url"
import path from 'path'
import morgan from 'morgan'
import helmet from 'helmet'
import { upload } from './middleware/midllewares.mjs'
import { register } from './controllers/auth.mjs'
import authRoute from './routes/auth.mjs'
import { createPost } from './controllers/post.mjs'
import userRoutes from "./routes/userRoutes.mjs"
import postRoutes from "./routes/post.mjs"
import { verifyToken } from './middleware/midllewares.mjs'


// Configuration
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
// app.use(bodyParser.json({ limit: "20mb" }))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({ extended: true, limit: "30mb" }))
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
const PORT = process.env.PORT
const DATABASE_URI = process.env.DATABASE_URI
app.use(cors())

connectDB(DATABASE_URI)



// ROUTING WITH FILES
app.post("/auth/register", upload.single('picture'), register)

app.post("/post", upload.single("picture"), verifyToken, createPost)

// ROUTING WITHOUT FILES
app.use('/auth', authRoute)

// User Routes
app.use("/users", userRoutes)

// Post Routes
app.use("/user", postRoutes)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})