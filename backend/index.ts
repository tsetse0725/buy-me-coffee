
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import listEndpoints from "express-list-endpoints";



const app = express();


const PORT = Number(process.env.PORT) || 8000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.set("x-powered-by", false);

app.set("trust proxy", 1);


app.use(
  cors({
    origin: [FRONTEND_ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "1mb" }));


app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


function safeUse(prefix: string, routes: express.Router) {
  try {
    app.use(prefix, routes);
    console.log(` Mounted: ${prefix || "/"}`);
  } catch (err) {
    console.error(` Crashed while mounting ${prefix || "/"}`, err);
    throw err;
  }
}


import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import bankcardRoutes from "./routes/bankcard.routes";
import donationRoutes from "./routes/donation.routes";
import mockpayRoutes from "./routes/mockpay.routes";
import userRoutes from "./routes/user.routes";

safeUse("/", authRoutes);
safeUse("/profiles", profileRoutes);
safeUse("/bankcards", bankcardRoutes);
safeUse("/donations", donationRoutes);
safeUse("/mockpay", mockpayRoutes);
safeUse("/users", userRoutes);


app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.status || 500;
  const message = err?.message || "Internal error";
  console.error(" Error:", { status, message });
  res.status(status).json({ message });
});


const server = app.listen(PORT, async () => {
  console.log(` Server running on port ${PORT}`);

  console.log(
    "  Endpoints:",
    listEndpoints(app)
      .map((e) => `${e.methods.join(",")} ${e.path}`)
      .join(" | ")
  );


});


async function shutdown(signal: string) {
  console.log(` Received ${signal}, shutting down...`);
  server.close(async () => {
    try {

    } finally {
      process.exit(0);
    }
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
