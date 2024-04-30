
import express from "express";
import env from "dotenv"
import dbConnection from "./db/dbConnection.js";
import router from "./router/route.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json());
app.use(cookieParser());

env.config()

const port = process.env.PORT || 5000  // Getting data from .env File


app.use("/", router)

app.use("/*", (req, res) => {
    res.send("Oops....! Please check the url again!!!")
})


app.listen(port, () => {
    dbConnection()
    console.log(`Server is connected on port ${port}`);
})