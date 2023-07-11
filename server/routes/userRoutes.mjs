import { getUser, editUserProfile, editPicture, editBio, editName, getUsers, searchUser } from "../controllers/user.mjs";
import express from "express"
import { verifyToken } from "../middleware/midllewares.mjs";
import { upload } from "../middleware/midllewares.mjs";

const router = express.Router()

router.get("/:id", verifyToken, getUser)


router.patch("/profile/update/:id", upload.single("picture"), editUserProfile)

router.get("/are/exist", verifyToken, getUsers)

router.get("/names/search", searchUser)

router.patch("/picupdate/:id", editPicture)

router.patch("/edit/bio/:id", editBio)


export default router