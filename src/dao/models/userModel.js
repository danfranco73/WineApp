import mongoose from "mongoose";
import { createHash } from "../../services/utils/functionsUtils.js";

const userCollection = "users";

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    minLength: 3,
    require: true,
  },
  last_name: {
    type: String,
    minLength: 3,
    require: true,
  },
  email: {
    type: String,
    minLength: 5,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 18,
    require: true,
  },
  password: {
    type: String,
     minLength: 5,
    require: true,
  },
  cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    require: true,
    default: "user",
  },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = createHash(this.password);
  }
  next();
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
