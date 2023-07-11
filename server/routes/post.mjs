import { getPosts, getPost, deletePost, likePost, editPost, commentPost, deleteComment } from "../controllers/post.mjs";
import { verifyToken } from "../middleware/midllewares.mjs";
import express from 'express'

const router = express.Router()

router.get("/posts", verifyToken, getPosts)

router.get("/post/:id", verifyToken, getPost)

router.delete("/post/delete/:id", deletePost)

router.patch("/post/likes/:id", verifyToken, likePost)

router.patch("/post/edit/:id", verifyToken, editPost)

router.patch("/post/comment/:id", commentPost)

router.delete("/post/comment/delete/:id/:commentId", deleteComment)

export default router