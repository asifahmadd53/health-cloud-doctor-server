import mongoose from "mongoose"

const timeSlotSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  isWorking: {
    type: Boolean,
    default: false,
  },
  timeSlots: [timeSlotSchema],
})

const scheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  schedule: [dayScheduleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
scheduleSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model("Schedule", scheduleSchema)
