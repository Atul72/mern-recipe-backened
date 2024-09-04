const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const recipeRouter = require("./routes/recipeRouter");
const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({ path: "./config.env" });

app.use(morgan("dev"));

mongoose
  .connect(process.env.DATABASE_URL)
  .then((doc) => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

app.listen(3001, () => {
  console.log("Hello from the server!");
});
