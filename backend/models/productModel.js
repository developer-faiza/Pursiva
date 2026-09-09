const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const productSchema = new Schema({
  image: {
    type: String
  },

  imagePublicId: {
    type: String
  },

  name: {
    type: String
  },
  price: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  bgcolor: {
    type: String
  },
  panelcolor: {
    type: String
  },
  textcolor: {
    type: String
  }
});

const productModel = model('product', productSchema);
module.exports = productModel;
