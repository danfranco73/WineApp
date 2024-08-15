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
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    require: true,
    default: "user",
  },
  documents: {
    type: [{ name: String, reference: String }],
  },
  last_connection: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = createHash(this.password);
  }
  next();
});
userSchema.pre("find", function (next) {
  this.populate("cart");
  next();
});
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
