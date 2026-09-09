const express = require('express');

const router = express.Router();

const productController = require('../controllers/productsController');
const ownerAuthMiddleware = require('../middlewares/ownerMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getSingleProduct);

router.post(
  '/create',
  ownerAuthMiddleware,
  upload.single('image'),
  productController.createProduct
);

router.put('/:id', ownerAuthMiddleware, upload.single('image'), productController.updateProduct);

router.delete('/:id', ownerAuthMiddleware, productController.deleteProduct);

module.exports = router;
