import express from "express";
import cors from "cors";

import profileRoutes from "./routes/profile.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoutes);

app.use("/profiles", profileRoutes);

const PORT = 8000;
app.listen(PORT, () =>
  console.log(` Server is running on http://localhost:${PORT}`)
);
