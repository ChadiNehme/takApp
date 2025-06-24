import express from 'express'
import { studentRegister } from '../controller/studentConroller.js'
import authStudent from '../middleware/authStudent.js';
import uploadToS3 from '../middleware/uploadToS3.js';

const studentRoute = express.Router()


studentRoute.post("/register", uploadToS3([{ name: "image", folder: "students" }]), studentRegister);


export default studentRoute