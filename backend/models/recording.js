const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema({
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  name: {
    type: String,
  },
  filePath: {
    type: String,
    required: true,
  },
});

const Record = mongoose.model("Record", recordingSchema);

module.exports = Record;
