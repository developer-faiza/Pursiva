const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true
        },

        name: {
          type: String,
          required: true
        },

        image: {
          type: String
        },

        price: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    shippingAddress: {
      fullname: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      }
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Order = model('Order', orderSchema);

module.exports = Order;
