import express from "express";
import { createServicePosting, searchServicePosting } from "../controllers/jobControllers.js";
const router = express.Router();


router.route("/postService").post(createServicePosting);
router.route("/searchService").post(searchServicePosting);

export default router;
