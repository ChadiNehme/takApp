import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";
import Admin from '../models/adminModel.js'
import { StatusCodes } from "http-status-codes";
import Path from "../models/pathModel.js";

import Course from "../models/courseModel.js";
import Coach from "../models/coachModel.js";
import { generateSignedUrl } from "../utils/s3signedUrl.js";


export const assignCoursesToCoach = async (req, res) => {
    const { coachId } = req.params;
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
        throw new BadRequestError("You must provide an array of course IDs.");
    }

    // Validate coach exists
    const coach = await Coach.findById(coachId);
    if (!coach) {
        throw new NotFoundError("Coach not found.");
    }

    // Validate all course IDs exist
    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
        throw new BadRequestError("One or more course IDs are invalid.");
    }

    // Assign courses
    coach.course = courseIds;
    await coach.save();

    res.status(StatusCodes.OK).json({
        msg: "Courses assigned successfully",
        coachId,
        assignedCourses: courses.map((c) => ({ _id: c._id, name: c.name })),
    });
};
// Get all pending coaches
export const getPendingCoaches = async (req, res) => {
    const coaches = await Coach.find({ approved: false }).populate("course", "name").lean();
    for (let coach of coaches) {
        coach.cvUrl = await generateSignedUrl(coach.cv); // add secure access
    }
    res.status(StatusCodes.OK).json({ nb: coaches.length, coaches });
};
export const approveCoach = async (req, res) => {
    const { id } = req.params;
    const coach = await Coach.findById(id);
    if (!coach) throw new NotFoundError("Coach not found.");

    coach.approved = true;
    coach.available = true;
    await coach.save();

    res.status(StatusCodes.OK).json({ msg: "Coach approved." });
};
// Reject a coach (delete from DB)
export const rejectCoach = async (req, res) => {
    const { id } = req.params;
    const coach = await Coach.findById(id);
    if (!coach) throw new NotFoundError("Coach not found.");

    await coach.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Coach rejected and deleted." });
};
export const getAllCoaches = async (req, res) => {
    const coaches = await Coach.find().select('-password').populate('course', 'name').lean()
    for (let coach of coaches) {
        coach.cvUrl = await generateSignedUrl(coach.cv); // add secure access
    }
    res.status(StatusCodes.OK).json({ success: true, nb: coaches.length, coaches })
}

export const getAllPaths = async (req, res) => {
    const paths = await Path.find()
    res.status(StatusCodes.OK).json({ success: true, paths })
}

export const getAllCourses = async (req, res) => {
    const courses = await Course.find().populate('path', 'name').lean()
    res.status(StatusCodes.OK).json({ success: true, courses })
}

export const addCoach = async (req, res) => {
    const {
        name,
        email,
        password,
        specialty,
        degree,
        experience,
        about,
        fees,
        availability,
        course,
    } = req.body;

    // Check required fields and files
    if (
        !name || !email || !password || !specialty || !degree ||
        !experience || !about || !fees || !course || !req.files?.image || !req.files?.cv
    ) {
        throw new BadRequestError('All fields including image and CV are required.')
    }

    const imageFile = req.files.image[0];
    const cvFile = req.files.cv[0];

    const newCoach = new Coach({
        name,
        email,
        password, // You can hash this later before save
        image: imageFile.location,  // Public S3 URL
        cv: cvFile.key,             // S3 object key for signed access
        specialty,
        degree,
        experience,
        about,
        fees,
        approved: true,
        availability: availability ? JSON.parse(availability) : [],
        course: course ? JSON.parse(course) : [],
    });

    await newCoach.save();

    res.status(StatusCodes.CREATED).json({
        message: "Coach created successfully",
        coach: newCoach,
    });

};


// Controller to handle adding a new learning path
export const addPath = async (req, res) => {
    const { name, description } = req.body;
    // Validation
    if (!name || !description || !req.files?.image || !req.files.image[0]) {
        throw new BadRequestError('All fields including image are required')
    }

    // Get the uploaded image URL from multer-s3
    const imageUrl = req.files.image[0].location;

    // Create new path
    const newPath = new Path({
        name,
        description,
        image: imageUrl,
    });

    await newPath.save();

    res.status(StatusCodes.CREATED).json({
        message: "Path created successfully",
        path: newPath,
    });

};
export const addCourse = async (req, res) => {
    const { name, description, path } = req.body
    if (!name || !description || !path || !req.files?.image || !req.files.image[0]) {
        throw new BadRequestError('All fileds are required')
    }
    const isPathExist = await Path.findById(path)
    if (!isPathExist) {
        throw new NotFoundError('path not found')
    }
    const imageUrl = req.files.image[0].location;
    const newCourse = new Course({
        name,
        description,
        image: imageUrl,
        path
    })
    await newCourse.save()
    res.status(StatusCodes.CREATED).json({
        message: "Course created successfully",
        course: newCourse,
    })
}


export const adminRegister = async (req, res) => {
    const admin = await Admin.create({ ...req.body })
    const Atoken = admin.CreateJWT()
    res.status(StatusCodes.CREATED).json({ Atoken })
}

export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new UnauthenticatedError('admin does not exist')
    }
    const isPasswordCorrect = await admin.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = admin.CreateJWT();
    res.status(StatusCodes.OK).json({ admin: { name: admin.name }, token })
}