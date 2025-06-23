import mongoose from "mongoose";

const pathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // S3 URL
});

export default mongoose.model("Path", pathSchema);
