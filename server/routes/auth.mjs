import express from 'express'
import { login, logout } from '../controllers/auth.mjs'

const router = express.Router()

router.post('/login', login)

router.patch('/user/logout/:id', logout)

export default router;