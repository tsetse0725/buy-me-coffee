/* src/server.ts */
import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import bankcardRoutes from "./routes/bankcard.routes";
import donationRoutes from "./routes/donation.routes";

const app = express();
app.use(cors());
app.use(express.json());

/* ─── 1. Static uploads ─── */
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* ─── Routes ─── */
app.use(authRoutes);                      // /login, /signup ...
app.use("/profiles", profileRoutes);      // /profiles & /profiles/upload-avatar
app.use("/bankcards", bankcardRoutes);
app.use("/donations", donationRoutes);    // /bankcards

/* ─── 2. Global error handler (optional) ─── */
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: err.message ?? "Internal error" });
});

const PORT = 8000;
app.listen(PORT, () =>
  console.log(`✅ Server is running on http://localhost:${PORT}`)
);
