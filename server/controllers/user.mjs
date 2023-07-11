import User from "../models/User.mjs";


export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) return res.status(404).json("User not found")

        res.status(200).json(user)
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: error.msg })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()

        const shuffledUsers = users.sort(() => Math.random() - 0.5)
        res.status(200).json(shuffledUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const editPicture = async (req, res) => {
    try {
        const { id } = req.params
        const { picturePath } = req.body
        const updateProfile = await User.findByIdAndUpdate(
            id,
            { picturePath },
            { new: true }
        )
        res.status(200).json(updateProfile)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const editName = async (req, res) => {
    try {
        const { id } = req.params
        const { firstName, lastName } = req.body
        const updateProfile = await User.findByIdAndUpdate(
            id,
            { firstName, lastName },
            { new: true }
        )
        res.status(200).json(updateProfile)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const editBio = async (req, res) => {
    try {
        const { id } = req.params
        const { bio } = req.body
        const updateProfile = await User.findByIdAndUpdate(
            id,
            { bio },
            { new: true }
        )
        res.status(200).json(updateProfile)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}


export const editUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { firstName, lastName, bio, picturePath } = req.body
        const userProfileUpdate = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, bio, picturePath },
            { new: true }
        )
        res.status(200).json(userProfileUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msgs })
    }
}

export const searchUser = async (req, res) => {
    try {
        const { firstName } = req.query
        const users = await User.find({
            firstName: { $regex: firstName, $options: 'i' }
        })
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}