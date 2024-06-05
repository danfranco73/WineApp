import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    purchase_datetime: {
        type: Date, default: Date.now
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String,
    },
    cart: {
        type: [{
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts',
            },
        }]
    },
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;





