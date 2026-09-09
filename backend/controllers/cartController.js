const User = require('../models/userModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const existingProduct = user.cart.find(item => item.productId.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity
      });
    }

    await user.save();

    return res.status(200).json({
      message: 'Product added to cart',
      cart: user.cart
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const cartWithProducts = await Promise.all(
      user.cart.map(async item => {
        const product = await Product.findById(item.productId);

        if (!product) {
          return null;
        }

        return {
          ...product.toObject(),
          quantity: item.quantity
        };
      })
    );

    const cart = cartWithProducts.filter(Boolean);

    return res.status(200).json({
      message: 'Cart fetched successfully',
      cart
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const cartItem = user.cart.find(item => item.productId.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({
        message: 'Product not found in cart'
      });
    }

    cartItem.quantity = quantity;

    await user.save();

    return res.status(200).json({
      message: 'Cart quantity updated',
      cart: user.cart
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await user.save();

    return res.status(200).json({
      message: 'Product removed from cart',
      cart: user.cart
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};
