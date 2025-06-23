import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  path: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Path',
  },

})
const courseModel = mongoose.model('Course', courseSchema)
export default courseModel
