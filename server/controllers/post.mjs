import Post from "../models/Post.mjs"


export const createPost = async (req, res) => {
    try {
        const { userId, title, description, picturePath } = req.body
        const newPost = new Post({
            userId,
            title,
            picturePath,
            description,
            likes: {},
            comments: [

            ]
        })
        await newPost.save()

        const post = await Post.find({}, null, { sort: { _id: -1 } }).populate("userId").populate("comments.userId")
        res.status(201).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err.msg, success: false })
    }
}


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}, null, { sort: { _id: -1 } }).populate("comments.userId").populate("userId")

        // if (!post || posts.length === 0) return res.status(404).json("No posts found");
        // const posts = post.sort(() => Math.random() - 0.5);

        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


export const getPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.find({ userId: id }, null, { sort: { _id: -1 } }).populate("userId").populate("comments.userId")
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


export const deletePost = async (req, res) => {
    try {
        // const { id } = req.params
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedPost)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        if (post) {
            const isLiked = post.likes.has(userId)

            if (isLiked) {
                post.likes.delete(userId)
            } else {
                post.likes.set(userId, true)
            }

            const updatedPost = await Post.findByIdAndUpdate(
                id,
                { likes: post.likes },
                { new: true }
            ).populate("userId")
            res.status(200).json(updatedPost)
        } else {
            res.status(404).json({ message: "Post not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const editPost = async (req, res) => {
    try {
        const { id } = req.params
        const { description, title } = req.body
        // console.log(description, title)
        const post = await Post.findByIdAndUpdate(
            id,
            { description, title },
            { new: true }
        ).populate("userId")
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const commentPost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId, comment } = req.body
        // console.log(userId, comment)
        const post = await Post.findById(id).populate('userId').populate("comments.userId")

        const newComment = {
            userId, comment, date: new Date()
        }

        post.comments.push(newComment)
        const userComment = await post.save()
        const updatedPosts = await userComment.populate('comments.userId')
        res.status(200).json(updatedPosts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params
        const post = await Post.findById(id).populate('comments.userId').populate('userId')

        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId)

        if (commentIndex !== -1) {
            post.comments.splice(commentIndex, 1)
            const updatedPosts = await post.save()
            res.status(200).json(updatedPosts)
        } else {
            res.status(404).json("Comment not found")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}