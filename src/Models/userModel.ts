import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: function (email: string) {
        try {
          return validator.isEmail(email);
        } catch (error: any) {
          console.log("error:", error.properties.message);
        }
      },
    },
    password: {
      type: String,
      required: false,
      minLength: 5,
    },
    profilePicture: { type: String, required: false },
    verified: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
