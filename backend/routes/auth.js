const {handleError,handleSuccess} = require('../utils/handleResponse')
const express = require("express");
const router = express.Router();
const Student = require("../models/students");
// const bcrypt = require("bcryptjs"); // To securely compare passwords
const jwt = require("jsonwebtoken");
const fetchStudent = require("../middleware/fetchStudent")

// route 1:- Create a new student   /create
const JWT_SECRET = 'elephantismyfavoritanimal';

// Route 1: Create a new student
router.post('/create', async (req, res) => {
    let success = false
    const { id, name, email, password } = req.body;

    try {
        // Check if the student already exists
        let student = await Student.findOne({ stud_id: id });
        if (student) {
            success = false
            return handleError(res, 'Student already exists', 400);
        }

        student = new Student({
            stud_id: id,
            name,
            email,
            password 
        });

        await student.save();

        const data = {
            user: {
                id: student._id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        return handleSuccess(res, { success:true , msg: 'Student created successfully', token: student._id, authToken });

    } catch (error) {
        console.error(error.message);
        return handleError(res, 'Internal Server Error', 500);
    }
});
  
  // route 2:- Student login      /login
  router.post('/login', async (req, res) => {
    const { stud_id, password } = req.body;
    // let success = false
    try {
        // Check if student exists
        const student = await Student.findOne({ stud_id });
        // console.log(student)
        if (!student) {
            return handleError(res, 'Student not found', 401);
        }

        const cleanPassword = password.trim();
        const cleanStoredPassword = student.password.trim();

        // Compare plain text passwords
        if (cleanPassword !== cleanStoredPassword) {
            success = false
            return handleError(res, 'Invalid credentials', 401);
        }

        const data = {
            user: {
                id: student._id
            }
        };
       console.log('data',data)
        const authToken = jwt.sign(data, JWT_SECRET);
       console.log('authToken',authToken)

        return handleSuccess(res, {success:true, msg: 'Login successful',token: authToken });

    } catch (error) {
        console.error(error.message);
        return handleError(res, 'Internal Server Error', 500);
    }
});
  
  module.exports = router;