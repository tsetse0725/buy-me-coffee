import multer from "multer";

// Buffer‑т хадгалж, шууд Cloudinary руу stream‑ээр дамжуулахын тулд memoryStorage ашиглана
const storage = multer.memoryStorage();
export const upload = multer({ storage });