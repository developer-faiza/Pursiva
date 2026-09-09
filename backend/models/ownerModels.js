const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;

const ownerSchema = new Schema({
  fullname: {
    type: String,
    minLength: 3,
    trim: true,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minLength: 6
  },

  contact: {
    type: Number
  },

  picture: {
    type: String
  },

  products: {
    type: Array,
    default: []
  }
});


ownerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});


ownerSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      ownerId: this._id.toString(),
      email: this.email
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30d'
    }
  );
};


ownerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const ownerModel = model('owner', ownerSchema);

module.exports = ownerModel;
