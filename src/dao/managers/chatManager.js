// chat manager
 import chatModel from "../../dao/models/chatModel.js";
 
class ChatManager {
    constructor() {
        this.messages = chatModel;
    }
    // getting all the messages from the database in my chat mongodb
    async getMessages() {
        try {
            const messages = await this.messages.find();
            return messages;
        } catch (error) {
            console.log(error);
        }
    }
 
    // adding a new message to the database in my chat mongodb
    async addMessage(message) {
        try {
            const newMessage = new this.messages(message);
            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.log(error);
        }
    }
    // getting a message by id in the database in my chat mongodb
    async getMessageById(id) {
        try {
            const message = await this.messages.findById(id);
            return message;
        } catch (error) {
            console.log(error);
        }
    }
    // updating a message in the database in my chat mongodb
    async updateMessage(id, message) {
        try {
            const updatedMessage = await this.messages.findByIdAndUpdate(id, message, {
                new: true,
            });
            return updatedMessage;
        } catch (error) {
            console.log(error);
        }
    }
    // deleting a message in the database in my chat mongodb
    async deleteMessage(id) {
        try {
            const message = await this.messages.findByIdAndDelete(id);
            return message;
        } catch (error) {
            console.log(error);
        }
    }
}
   

export default ChatManager;


