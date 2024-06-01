import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const chatModel = mongoose.model(messageCollection, messageSchema);

export default chatModel;