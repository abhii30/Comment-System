const express = require("express");
const app = express();
const Comment = require("./routes/routes");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(express.json());
app.use(Comment);

app.listen(3001, () => console.log("Server is running at port 3001..."));

mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("Connected to database")
);
