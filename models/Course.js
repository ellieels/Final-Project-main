import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcrypt';

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    unique: true,
  }
});

// Check if the model exists before compiling it
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;
