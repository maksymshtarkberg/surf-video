import mongoose from "mongoose";
import Counter from "./counter.model";

const videosSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "video id is required"],
      unique: true,
      min: 1,
    },
    title: {
      required: [true, "title is required"],
      type: String,
      unique: true,
      trim: true,
    },
    slug: {
      required: [true, "slug is required"],
      type: String,
      unique: true,
      trim: true,
    },
    videoSrc: {
      required: [true, "Video source URL is required"],
      type: String,
      unique: true,
      trim: true,
    },
    thumbnail: {
      required: [false, "thumbnail is required"],
      type: String,
    },
    poster: {
      required: [false, "poster is required"],
      type: String,
    },
    alternativeTitle: {
      type: String,
      default: "",
      trim: true,
    },
    isHD: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      required: [false, "duration is required"],
    },
    plattform: {
      type: String,
      required: [true, "plattform is required"],
    },
    originalId: {
      type: String,
      required: [true, "originalId is required"],
    },
    originalImage: {
      type: String,
      required: [true, "originalImage is required"],
    },
    views: {
      type: Number,
      default: 1,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    tags: {
      default: [],
      type: [String],
    },
    categories: {
      default: [],
      type: [String],
    },
    models: {
      default: [],
      type: [String],
    },
    isUp: {
      default: true,
      type: Boolean,
    },
    lastUpCheck: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

videosSchema.pre("save", function (next) {
  const doc = this;

  Counter.findByIdAndUpdate(
    { _id: "videos" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    (error, counter) => {
      if (error) {
        console.error("Error updating counter:", error);
        return next(error);
      }
      if (!counter) {
        console.error("No counter found or created.");
        return next(new Error("Counter not found"));
      }
      doc.id = counter.seq;
      next();
    }
  );
});

videosSchema.index({
  title: "text",
  alternativeTitle: "text",
  tags: "text",
  categories: "text",
  models: "text",
});

const Videos = mongoose.models.Videos || mongoose.model("Videos", videosSchema);

export default Videos;
