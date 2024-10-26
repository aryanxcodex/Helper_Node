import express from "express";
import {
  createServicePosting,
  searchServicePosting,
  applyService,
  approveServiceProvider,
} from "../controllers/serviceControllers.js";
import { getCoordinatesMiddleware } from "../middleware/geoCoding.js";
import findNearbyProviders from "../middleware/findNearbyProviders.js";
const router = express.Router();

router
  .route("/postService")
  .post(getCoordinatesMiddleware, createServicePosting);
router
  .route("/searchServiceProviders")
  .post(findNearbyProviders, searchServicePosting);
router.route("/applyService").post(applyService);
router.route("/approveServiceProvider").post(approveServiceProvider);

export default router;
