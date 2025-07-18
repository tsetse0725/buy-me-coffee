import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import listEndpoints from "express-list-endpoints";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import bankcardRoutes from "./routes/bankcard.routes";
import donationRoutes from "./routes/donation.routes";
import mockpayRoutes from "./routes/mockpay.routes";
import userRoutes from "./routes/user.routes"; 

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

function safeUse(prefix: string, routes: express.Router) {
  try {
    app.use(prefix, routes);
    console.log(` mounted ${prefix || "/"}`);
  } catch (err) {
    console.error(` crashed while mounting ${prefix || "/"}`);
    throw err;
  }
}

safeUse("/", authRoutes);
safeUse("/profiles", profileRoutes);
safeUse("/bankcards", bankcardRoutes);
safeUse("/donations", donationRoutes);
safeUse("/mockpay", mockpayRoutes);
safeUse("/users", userRoutes); 
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("", err);
  res.status(500).json({ message: err.message ?? "Internal error" });
});

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`  Server is running on port ${PORT}`);
});
