const Product = require('../models/productModel');

const cloudinary = require('../config/cloudinary');

const createProduct = async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: 'Product image is required'
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    const createdProduct = await Product.create({
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ message: 'All products', products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    return res.status(200).json({ message: 'product', product });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      product.image = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    product.name = name;
    product.price = price;
    product.discount = discount;
    product.bgcolor = bgcolor;
    product.panelcolor = panelcolor;
    product.textcolor = textcolor;

    await product.save();

    return res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Product deleted successfully',
      product
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };
