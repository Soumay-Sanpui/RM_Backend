import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  category: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  dishType: { type: String, required: true },
});

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
