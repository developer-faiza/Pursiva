const Owner = require('../models/ownerModels');


const owner = async (req, res) => {
  try {
    const ownerExist = await Owner.find();

    if (ownerExist.length > 0) {
      return res.status(403).json({
        message: "You don't have permission to create a new Owner"
      });
    }

    const { fullname, email, password } = req.body;

    const owner = await Owner.create({
      fullname,
      email,
      password
    });

   return res.status(201).json({
     message: 'Owner created successfully',
     owner: {
       id: owner._id,
       fullname: owner.fullname,
       email: owner.email
     }
   });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};


const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await owner.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = owner.generateToken();

    return res.status(200).json({
      message: 'Owner login successful',
      token,
      owner: {
        id: owner._id,
        fullname: owner.fullname,
        email: owner.email
      }
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  owner,
  ownerLogin
};
