import express from 'express';
const router = express.Router();
import {
  createProduct,
  getTraderProducts,
  updateProduct,
  deleteProduct,
  getAvailableProducts,
  lockProduct,
  unlockProduct,
  getVendorLockedProducts
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

// 1. STATIC ROUTES (Must be at the top to prevent /:id interception)
router.get('/available', protect, authorize('vendor'), getAvailableProducts);
router.get('/locked', protect, authorize('team-member', 'vendor'), getVendorLockedProducts);

router.route('/trader')
  .post(protect, authorize('trader'), createProduct)
  .get(protect, authorize('trader'), getTraderProducts);

// 2. DYNAMIC ROUTES WITH PARAMS (Must be at the bottom)
router.route('/trader/:id')
  .put(protect, authorize('trader'), updateProduct)
  .delete(protect, authorize('trader'), deleteProduct);

router.post('/:id/lock', protect, authorize('vendor'), lockProduct);
router.post('/:id/unlock', protect, authorize('vendor'), unlockProduct);

export default router;
