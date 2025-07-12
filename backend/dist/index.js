"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const bankcard_routes_1 = __importDefault(require("./routes/bankcard.routes"));
const donation_routes_1 = __importDefault(require("./routes/donation.routes"));
const mockpay_routes_1 = __importDefault(require("./routes/mockpay.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes")); // ✅ нэмсэн
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
function safeUse(prefix, routes) {
    try {
        app.use(prefix, routes);
        console.log(` mounted ${prefix || "/"}`);
    }
    catch (err) {
        console.error(` crashed while mounting ${prefix || "/"}`);
        throw err;
    }
}
safeUse("/", auth_routes_1.default);
safeUse("/profiles", profile_routes_1.default);
safeUse("/bankcards", bankcard_routes_1.default);
safeUse("/donations", donation_routes_1.default);
safeUse("/mockpay", mockpay_routes_1.default);
safeUse("/users", user_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error("", err);
    res.status(500).json({ message: err.message ?? "Internal error" });
});
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map