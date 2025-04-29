import mongoose from "mongoose";

const CoWorkingSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Name can not be more than 500 characters"],
    },
    address: { type: String, required: [true, "Please add an address"] },
    province: { type: String, required: [true, "Please add a province"] },
    district: { type: String, required: [true, "Please add a district"] },
    subDistrict: { type: String, required: [true, "Please add a sub-district"] },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal code can not be more than 5 digits"],
    },
    openTime: { type: Date, required: [true, "Please add open time"] },
    closeTime: { type: Date, required: [true, "Please add close time"] },
    tel: { type: String, required: false },
    picture: { type: String, required: false },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const model = mongoose.model("CoworkingSpace", CoWorkingSpaceSchema);
export type CoworkingSpaceType = InstanceType<typeof model>;

export default model;
