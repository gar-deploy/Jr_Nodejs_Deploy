import express from "express"
import { login, logout, signup } from "../controller/userController.js"
import { deleteFile, getFiles, uploadFile } from "../controller/fileController.js"
import upload from "../middleware/multer.js"
import protectRoute from "../middleware/protectedRoute.js"
import { handleError } from "../middleware/errorHandler.js"

const router = express.Router()


//************ USER Route ************* */

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// **************** Files Route *******************

router.post("/upload", protectRoute, upload.array("file", 5), handleError, uploadFile)
router.get("/getfiles", protectRoute, getFiles)
router.delete("/deletefiles/:nameOfFile", protectRoute, deleteFile)



export default router;