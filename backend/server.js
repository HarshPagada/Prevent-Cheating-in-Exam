const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
// const AWS = require("aws-sdk");


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

// AWS.config.update({
//   region: "us-east-1", // e.g., 'us-east-1'
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use environment variables
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// const dynamoDB = new AWS.DynamoDB.DocumentClient();
// const tableName = "Users"; // Your DynamoDB table name

app.use('/auth',require('./routes/auth'))
app.use('/record',require('./routes/record'))

let PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
