import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  dish: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Dish", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    default: 1 
  }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

cartSchema.methods.calculateTotalAmount = async function() {
  let total = 0;
  await this.populate('items.dish');
  
  for (const item of this.items) {
    total += item.dish.price * item.quantity;
  }
  
  this.totalAmount = total;
  return total;
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
