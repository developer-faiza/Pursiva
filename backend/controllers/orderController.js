const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { fullname, phone, address, city } = req.body;

    if (!fullname || !phone || !address || !city) {
      return res.status(400).json({
        message: 'All shipping information is required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty'
      });
    }

    const orderProducts = [];

    for (const item of user.cart) {
      const product = await Product.findById(item.productId);

      if (!product) {
        continue;
      }

      orderProducts.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });
    }

    if (orderProducts.length === 0) {
      return res.status(400).json({
        message: 'No valid products found in cart'
      });
    }

    const totalAmount = orderProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,

      products: orderProducts,

      totalAmount,

      shippingAddress: {
        fullname,
        phone,
        address,
        city
      }
    });

    
    user.cart = [];

    await user.save();

    return res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId
    })
      .populate('products.product')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'fullname email').sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'All orders fetched successfully',
      orders
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
