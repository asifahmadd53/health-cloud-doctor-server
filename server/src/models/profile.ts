// import mongoose from "mongoose"

// const profileSchema = new mongoose.Schema({
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Doctor",
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   specialty: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   experience: {
//     type: String,
//     required: true,
//   },
//   licenseNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   certifications: {
//     type: String,
//     required: false,
//   },
//   bio: {
//     type: String,
//     required: false,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   clinicAddress: {
//     type: String,
//     required: false,
//   },
//   profileImage: {
//     type: String,
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// // Update the updatedAt field before saving
// profileSchema.pre("save", function (next) {
//   this.updatedAt = new Date()
//   next()
// })

// export default mongoose.model("Profile", profileSchema)
