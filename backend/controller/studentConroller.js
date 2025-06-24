import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js"
import Student from "../models/studentModel.js"


export const studentRegister = async (req, res) => {
    if (!req.files?.image) {
        throw new BadRequestError('All fields including image are required.')
    }
    const imageFile = req.files.image[0];
    req.body.image = imageFile.location
    const student = await Student.create({ ...req.body })
    const token = student.CreateJWT()
    res.status(StatusCodes.CREATED).json({ token })
}