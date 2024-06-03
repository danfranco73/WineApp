import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, required: true, unique: true
    },
    purchase_datetime: {
        type: Date, default: Date.now
    },
    amount: {
        type: Number, required: true
    },
    purchaser: {
        type: String, required: true
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





