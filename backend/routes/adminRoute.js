import express from 'express'
import { addCoach, addCourse, addPath, adminLogin, adminRegister, assignCoursesToCoach, getAllCoaches, getAllCourses, getAllPaths } from '../controller/adminController.js'
import uploadToS3 from '../middleware/uploadToS3.js'
import authAdmin from '../middleware/authAdmin.js'
import {
    getPendingCoaches,
    approveCoach,
    rejectCoach,
} from "../controller/adminController.js";


const adminRoute = express.Router()

adminRoute.get("/coach-requests", getPendingCoaches);
adminRoute.patch("/approve-coach/:id", approveCoach);
adminRoute.delete("/reject-coach/:id", rejectCoach);
adminRoute.post('/register', adminRegister)
adminRoute.post('/login', adminLogin)
adminRoute.post("/add-path", uploadToS3([{ name: "image", folder: "paths" }]), addPath);
adminRoute.post("/add-course", uploadToS3([{ name: "image", folder: "courses" }]), addCourse);
adminRoute.post("/add-coach",
    uploadToS3([
        { name: "image", folder: "coaches" },
        { name: "cv", folder: "cv" }
    ]),
    addCoach
);
adminRoute.get('/get-all-courses', getAllCourses)
adminRoute.get('/get-all-paths', getAllPaths)
adminRoute.get('/get-all-coaches', getAllCoaches)
adminRoute.patch("/assign-courses/:coachId", assignCoursesToCoach);



export default adminRoute