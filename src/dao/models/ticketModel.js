import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
