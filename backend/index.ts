/* src/index.ts */
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import listEndpoints from "express-list-endpoints";

import authRoutes     from "./routes/auth.routes";
import profileRoutes  from "./routes/profile.routes";
import bankcardRoutes from "./routes/bankcard.routes";
import donationRoutes from "./routes/donation.routes";
import mockpayRoutes  from "./routes/mockpay.routes"; // 🆕 mock invoice page

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", // 👈 front‑end URL
    credentials: true,                       // allow cookies / SSE cred
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* ────────────── Helper: safe mount ───────────── */
function safeUse(prefix: string, routes: express.Router) {
  try {
    app.use(prefix, routes);
    console.log(`✅ mounted ${prefix || "/"}`);
  } catch (err) {
    console.error(`❌ crashed while mounting ${prefix || "/"}`);
    throw err;
  }
}

/* ────────────── Routes ────────────── */
safeUse("/",          authRoutes);       // /signup, /login
safeUse("/profiles",  profileRoutes);    // /profiles/...
safeUse("/bankcards", bankcardRoutes);   // /bankcards/...
safeUse("/donations", donationRoutes);   // /donations/...
safeUse("/mockpay",   mockpayRoutes);    // /mockpay/:id (mock invoice)

/* ────────────── Error handler ────────────── */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🟥", err);
  res.status(500).json({ message: err.message ?? "Internal error" });
});

/* ────────────── Start server ────────────── */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    // console.table(listEndpoints(app));
  }
});