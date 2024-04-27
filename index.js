
import express from "express";
import env from "dotenv"
import dbConnection from "./db/dbConnection.js";
import router from "./router/userRouter.js";

const app = express()

env.config()

const port = process.env.PORT || 5000


app.use("/", router)

app.use("/*", (req, res) => {
    res.send("Please check the url!!!")
})


app.listen(port, () => {
    dbConnection()
    console.log(`Server is connected on port ${port}`);
})