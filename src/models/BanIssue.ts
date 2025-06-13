import mongoose from "mongoose";

const BanIssueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    admin: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: [50, "Title can not be more than 50 characters"] },
    description: {
      type: String,
      required: true,
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    createdAt: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const model = mongoose.model("BanIssue", BanIssueSchema);
export type BanIssueType = InstanceType<typeof model>;

export default model;
