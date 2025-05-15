import multer from "multer";

// Configure storage
const storage = multer.memoryStorage();

// // File filter to accept only images
// const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// // Configure upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max file size
//   },
//   fileFilter: fileFilter,
// });

const upload = multer({ storage: storage });

export default upload;