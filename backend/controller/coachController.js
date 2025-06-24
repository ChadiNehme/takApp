import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js"
import Coach from "../models/coachModel.js"


export const loginCoach = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const coach = await Coach.findOne({ email })
    if (!coach) {
        throw new UnauthenticatedError('admin does not exist')
    }
    const isPasswordCorrect = await coach.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = coach.CreateJWT();
    res.status(StatusCodes.OK).json({ coach: { name: coach.name }, token })
}
export const setCoachAvailability = async (req, res) => {
    const coachId = req.coach.coachId;
    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length === 0) {
        throw new BadRequestError("Availability must be a non-empty array.");
    }

    // Basic validation of each slot
    const isValid = availability.every(slot =>
        slot.day && slot.startTime && slot.endTime
    );
    if (!isValid) {
        throw new BadRequestError("Each availability slot must include day, startTime, and endTime.");
    }

    const coach = await Coach.findById(coachId);
    if (!coach) {
        throw new NotFoundError("Coach not found.");
    }

    coach.availability = availability;
    await coach.save();

    res.status(StatusCodes.OK).json({
        msg: "Availability updated successfully",
        availability: coach.availability
    });
};