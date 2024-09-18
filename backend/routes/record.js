const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Record = require('../models/recording'); 
const router = require('./auth');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

router.post('/recording', upload.single('file'), async (req, res) => {
  try {
    const { stud_id, name } = req.body;
    const file = req.file; 

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newRecording = new Record({
      stud_id: mongoose.Types.ObjectId(stud_id),
      name,
      filePath: file.path, 
    });

    await newRecording.save();

    res.status(201).json(newRecording);
  } catch (error) {
    console.error('Error creating recording:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports  = router;
