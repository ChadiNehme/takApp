import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true }, // public S3 URL
  cv: { type: String, required: true },     // S3 key for signed access
  specialty: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
  fees: { type: Number, required: true },
  adminMessage: { type: String },
  slots_booked: [
    {
      date: Date,
      time: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ],
  course: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  availability: [
    {
      day: { type: String, required: true },       // e.g., 'Monday'
      startTime: { type: String, required: true }, // e.g., '16:00'
      endTime: { type: String, required: true },   // e.g., '17:00'
    }
  ]
}, { timestamps: true, minimize: false });

const coachModel = mongoose.model("Coach", coachSchema);
export default coachModel;
