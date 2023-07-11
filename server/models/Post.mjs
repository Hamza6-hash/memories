import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },

    title: {
        type: String,
        required: true
    },

    picturePath: {
        type: String,
    },

    description: {
        type: String,
        required: true
    },

    likes: {
        type: Map,
        of: Boolean
    },

    // comments: {
    //     type: Array,
    //     default: []
    // }
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                // type: String,
                required: true,
                ref: "User",
            },

            comment: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }]

}, { timestamps: true })


const Post = mongoose.model("Post", postSchema)
export default Post