
import jwt from 'jsonwebtoken'
import multer from 'multer';

// JWT TOKEN
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).json("Access Denied");
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimStart()
        }
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

export const upload = multer({ storage })