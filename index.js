const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute")
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
	res.send("hahaahha")
})

const port = process.env.PORT || 5000;
const uri = process.env.URI;

app.listen(port, () => {
  console.log(`server running on port:${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connect establish"))
  .catch((error) => console.log("MongoDB connection failed"));
