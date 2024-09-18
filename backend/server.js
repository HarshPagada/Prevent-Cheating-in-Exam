const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json()); // to parse JSON-encoded bodies
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/Prevent-Cheating")
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(`DB CONNECTION ERR: ${err}`);
  });

app.get("/hello", (req, res) => {
  return res.send("Hello World");
});

app.use('/auth',require('./routes/auth'))
app.use('/record',require('./routes/record'))

let PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
