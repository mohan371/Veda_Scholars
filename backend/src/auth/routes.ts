import { Router } from "express";
import { signup, login, googleAuth, verifyOTP } from "./controller";
import rateLimit from "express-rate-limit";

const router: Router = Router();

// Rate Limiter: 5 attempts per minute
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: "Too many login attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", authLimiter, login);
router.post("/google", googleAuth);

export default router;
