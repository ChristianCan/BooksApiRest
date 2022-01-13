//Modules
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

//Router
const routes = require("./routes/router");

//Middleware to parse body
app.use(express.json());

//Connect to mongoose
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes
app.use(routes);
app.get("/", function (req, res) {
  res.send("API - Books Library");
});
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Ups!!! Resource not found.",
  });
});

app.listen(port);
console.log("Server on port", port);
