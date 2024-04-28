import express from "express"
import { login, logout, signup } from "../controller/userController.js"
import { uploadFile } from "../controller/fileController.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)



router.post("/upload",upload.single('file'), uploadFile)


export default router