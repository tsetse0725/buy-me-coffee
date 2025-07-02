import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ⬇️ Image upload route
app.use("/profiles", profileRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
