import mongoose from 'mongoose'
import Product from '../models/Product.js';

// TRADER ENDPOINTS
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, basePrice, isActive, category } = req.body;
    const product = await Product.create({
      name,
      description,
      basePrice,
      category,
      isActive,
      createdBy: req.user._id
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getTraderProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ createdBy: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// VENDOR ENDPOINTS
export const getAvailableProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({ isActive: true });
    // Force the user ID into a pure string
    const myId = String(req.user._id);

    const availableProducts = allProducts.filter(product => {
      // Force every ID in the array into a pure string
      const lockedArray = (product.lockedByVendors || []).map(id => String(id));
      return !lockedArray.includes(myId);
    });

    res.status(200).json(availableProducts);
  } catch (error) {
    next(error);
  }
};

export const lockProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { lockedByVendors: req.user._id } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Locked successfully', product });
  } catch (error) { next(error); }
};

export const unlockProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $pull: { lockedByVendors: req.user._id } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Unlocked successfully', product });
  } catch (error) { next(error); }
};

export const getVendorLockedProducts = async (req, res, next) => {
  try {
    const rawId = req.user.role === 'vendor' ? req.user._id : req.user.vendorId;
    if (!rawId) return res.status(200).json([]);

    // Force the target ID into a pure string
    const targetId = String(rawId);

    const allProducts = await Product.find({ isActive: true });

    const lockedProducts = allProducts.filter(product => {
      // Force every ID in the array into a pure string
      const lockedArray = (product.lockedByVendors || []).map(id => String(id));
      return lockedArray.includes(targetId);
    });

    res.status(200).json(lockedProducts);
  } catch (error) {
    next(error);
  }
};