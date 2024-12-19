import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  totalOrders: { type: Number, default: 0 },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
  cart: [{
    dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
    quantity: { type: Number, default: 1 }
  }]
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
