import express from "express"
import { login, logout, signup } from "../controller/userController.js"
import { deleteFile, getFiles, uploadFile } from "../controller/fileController.js"
import upload from "../middleware/multer.js"
import protectRoute from "../middleware/protectedRoute.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)



router.post("/upload",protectRoute, upload.single('file'), uploadFile)
router.get("/getfiles",protectRoute, getFiles)
router.delete("/deletefiles/:id",protectRoute, deleteFile)


export default router;