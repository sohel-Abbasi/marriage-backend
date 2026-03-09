import express from "express";
import Biodata from "../models/Biodata.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const biodata = await Biodata.findOne({ user: req.userId });
    return res.json({ biodata });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Fetch biodata error", error);
    return res
      .status(500)
      .json({ message: "Unable to load biodata. Please try again." });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { biodata } = req.body;

    if (!biodata || typeof biodata !== "object") {
      return res.status(400).json({ message: "Invalid biodata payload" });
    }

    const existing = await Biodata.findOne({ user: req.userId });
    if (existing) {
      existing.personal = biodata.personal || existing.personal;
      existing.family = biodata.family || existing.family;
      existing.educationProfession =
        biodata.educationProfession || existing.educationProfession;
      existing.horoscope = biodata.horoscope || existing.horoscope;
      existing.preferences = biodata.preferences || existing.preferences;
      existing.photo = biodata.photo || existing.photo;

      await existing.save();
      return res.json({ biodata: existing });
    }

    const created = await Biodata.create({
      user: req.userId,
      personal: biodata.personal || {},
      family: biodata.family || {},
      educationProfession: biodata.educationProfession || {},
      horoscope: biodata.horoscope || {},
      preferences: biodata.preferences || {},
      photo: biodata.photo || {},
    });

    return res.status(201).json({ biodata: created });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Save biodata error", error);
    return res
      .status(500)
      .json({ message: "Unable to save biodata. Please try again." });
  }
});

export default router;

