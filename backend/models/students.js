const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    stud_id: {
        type: Number,
        required: true,
        unique: true,
        min: 10000,  // Assuming a 5-digit minimum
        max: 999999999,  // Assuming a 9-digit maximum
        // trim: true,
    },
    name: {
        type: String,
        maxlength: 32,
    },
    email: {
        type: String,
    },
    password: {
        type: mongoose.Schema.Types.Mixed,
    },
    assignedExams: {
        type: Array,
        // default: [],
    },
    submittedExams: {
        type: Object,
        // default: {},
    },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
