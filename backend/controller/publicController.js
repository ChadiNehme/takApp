import Coach from "../models/coachModel.js";
import { BadRequestError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const applyAsCoach = async (req, res) => {
  const {
    name,
    email,
    password,
    specialty,
    degree,
    experience,
    about,
    fees,
    adminMessage
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !specialty ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !adminMessage||
    !req.files?.image ||
    !req.files?.cv
  ) {
    throw new BadRequestError("All fields and files are required.");
  }

  const existing = await Coach.findOne({ email });
  if (existing) {
    throw new BadRequestError("Coach with this email already exists");
  }

  const imageUrl = req.files.image[0].location;
  const cvKey = req.files.cv[0].key;

  const newCoach = new Coach({
    name,
    email,
    password,
    image: imageUrl,
    cv: cvKey,
    specialty,
    degree,
    experience,
    about,
    fees,
    adminMessage,
    approved: false,
    available: false,
  });

  await newCoach.save();

  res.status(StatusCodes.CREATED).json({ msg: "Application submitted." });
};
