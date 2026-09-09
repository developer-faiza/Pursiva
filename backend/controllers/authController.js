const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    const userCreated = await User.create({
      fullname,
      email,
      password
    });

    const token = userCreated.generateToken();

    const user = userCreated.toObject();
    delete user.password;

    return res.status(201).json({
      message: 'Registration successful',
      user,
      token,
      userId: userCreated._id.toString()
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isMatch = await userExist.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = userExist.generateToken();

    const user = userExist.toObject();
    delete user.password;

    return res.status(200).json({
      message: 'User logged in successfully',
      user,
      token,
      userId: userExist._id.toString()
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, email, contact } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({
        message: 'Full name and email are required'
      });
    }

    
    const emailExist = await User.findOne({
      email,
      _id: { $ne: req.user.userId }
    });

    if (emailExist) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullname,
        email,
        contact
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!userUpdated) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userUpdated
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  updateProfile
};
