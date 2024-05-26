import express from "express"
import bodyParser from "body-parser"
import routes from "./routes"
import cors from "cors"

const app = express()
require("dotenv").config()

const corsOptions = {
  origin: "http://localhost:3000",
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
