import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import routes from "./routes"

const app = express()
require("dotenv").config()

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use("/api", routes)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
