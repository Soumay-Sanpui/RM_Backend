import Dish from "../models/dishes.model.js";
export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isAvailable: true });
    
    if (!dishes || dishes.length === 0) {
      return res.status(404).json({
        message: "No dishes found"
      });
    }

    return res.status(200).json({
      message: "Dishes retrieved successfully",
      data: dishes
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving dishes",
      error: error.message
    });
  }
};

export const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();

    if (!dishes || dishes.length === 0) {
      return res.status(404).json({
        message: "No dishes found"
      });
    }

    return res.status(200).json({
      message: "All dishes retrieved successfully", 
      data: dishes
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving dishes",
      error: error.message
    });
  }
};

export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Dish ID is required"
      });
    }

    const dish = await Dish.findById(id);
    
    if (!dish) {
      return res.status(404).json({
        message: "Dish not found"
      });
    }

    return res.status(200).json({
      message: "Dish retrieved successfully",
      data: dish
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving dish",
      error: error.message
    });
  }
};

export const createDish = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - Please login"
      });
    }

    const { dishName, description, price, image, category, isAvailable, dishType } = req.body;

    if (!dishName || !description || !price || !category || !dishType) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["dishName", "description", "price", "category", "dishType"]
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    const dish = await Dish.create({
      dishName,
      description,
      price,
      image,
      category,
      isAvailable: isAvailable ?? true,
      dishType
    });

    return res.status(201).json({
      message: "Dish created successfully",
      data: dish
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating dish",
      error: error.message
    });
  }
};

export const getDishByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        message: "Category parameter is required"
      });
    }

    const dishes = await Dish.find({ category });

    if (!dishes || dishes.length === 0) {
      return res.status(404).json({
        message: "No dishes found for this category"
      });
    }

    return res.status(200).json({
      message: "Dishes retrieved successfully",
      data: dishes
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving dishes",
      error: error.message
    });
  }
};
