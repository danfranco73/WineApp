import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    _user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
    products: {
        type: [{ _id: mongoose.Schema.Types.ObjectId, qty: Number }],
        required: true,
        ref: "products",
      },
    },
    { timestamps: true }
);


const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;