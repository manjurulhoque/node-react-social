import { Router } from "express";
import authRoute from "./routes/auth";
import usersRoute from "./routes/users";
import postsRoute from "./routes/posts";

const router = Router();

// API Routes
router.use("/auth", authRoute);
router.use("/users", usersRoute);
router.use("/posts", postsRoute);

export default router;
