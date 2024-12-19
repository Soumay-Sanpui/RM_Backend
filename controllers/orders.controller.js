import Order from "../models/orders.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, deliveryAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.dish');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      dish: item.dish._id,
      quantity: item.quantity,
      price: item.dish.price
    }));

    // Create new order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Clear the cart after order creation
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId })
      .populate('items.dish')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.dish');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if the user is authorized to view this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('items.dish');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is authorized to cancel this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is not pending"
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};
