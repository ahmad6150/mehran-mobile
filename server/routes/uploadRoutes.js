import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  (req, res) => {
    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  }
);

export default router;