import Cart from "../models/cart.model.js";
import Dish from "../models/dishes.model.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate('items.dish');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    await cart.calculateTotalAmount();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, dishId, quantity = 1 } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.dish.toString() === dishId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ dish: dishId, quantity });
    }

    await cart.calculateTotalAmount();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, dishId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.dish.toString() === dishId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.calculateTotalAmount();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, dishId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.dish.toString() !== dishId
    );

    await cart.calculateTotalAmount();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
}; 