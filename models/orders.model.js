import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  dish: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Dish", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [orderItemSchema],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

