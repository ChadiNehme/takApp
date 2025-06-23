import express from "express";
import { applyAsCoach } from "../controller/publicController.js";
import uploadToS3 from "../middleware/uploadToS3.js";

const publicRoute = express.Router();

publicRoute.post(
  "/apply-coach",
  uploadToS3([
    { name: "image", folder: "coaches" },
    { name: "cv", folder: "cv" }
  ]),
  applyAsCoach
);

export default publicRoute;
