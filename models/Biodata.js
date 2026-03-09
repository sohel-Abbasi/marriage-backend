import mongoose from "mongoose";

const biodataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    personal: {
      type: Object,
      default: {},
    },
    family: {
      type: Object,
      default: {},
    },
    educationProfession: {
      type: Object,
      default: {},
    },
    horoscope: {
      type: Object,
      default: {},
    },
    preferences: {
      type: Object,
      default: {},
    },
    photo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

const Biodata = mongoose.model("Biodata", biodataSchema);

export default Biodata;

