import express from "express";
import { createServicePosting } from "../controllers/jobControllers.js";
const router = express.Router();


router.route("/postService").post(createServicePosting);

export default router;
