const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const mainRouter = require("./router/mainRouter")
require("./sockets/main")
require("dotenv").config()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log("Connection success")
    }).catch(e => {
    console.log(e)
})

app.use("/", mainRouter);

app.listen(4001, () => {
    console.log("Server is running on port 4001")
})