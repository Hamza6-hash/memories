import User from "../models/User.mjs";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            bio,
            picturePath,
        } = req.body

        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(404).json({ message: "User already exist", success: false })
        }

        const salt = 10
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            bio,
            picturePath
        })
        await newUser.save()
        res.status(201).json({ message: "Register Succesfully", success: true })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: `Something went wrong` })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const isMatch = await bcrypt.compare(password, user.password)

        user.loginTime = new Date()
        user.save()

        if (!isMatch) return res.status(400).json({ message: " Invalid Credentials ", success: false })

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "2 days" })
        delete user.password
        res.status(200).json({ user, token })

    } catch (err) {
        res.status(500).json({ message: `Something went wrong ${err.message}` })
    }
}


export const logout = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(
            id,
            { logoutTime: new Date() },
            { new: true }
        )
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.msg })
    }
}
