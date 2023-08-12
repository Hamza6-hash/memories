import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exist"]
    },
    password: {
        type: String,
        required: true,
    },
    picturePath: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: []
    },
    loginTime: {
        type: Date,
        default: null
    },
    logoutTime: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = mongoose.model("User", UserSchema)
export default User