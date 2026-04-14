/**
 * ─────────────────────────────────────────────
 *  Product Model — VIP Summer Collection
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    nameAr: {
      type: String,
      trim: true,
      maxlength: [120, 'Arabic name cannot exceed 120 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    category: {
      type: String,
      enum: ['hoodies', 'jackets', 'tees', 'pants', 'sneakers', 'accessories', 'dresses', 'skirts', 'blouses'],
      default: 'tees',
    },
    tag: {
      type: String,
      enum: ['New', 'Hot', 'Limited', 'Exclusive', null],
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    collection: {
      type: String,
      default: 'Summer 2026',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ─── Formatted Price Virtual (EGP) ──────── */
productSchema.virtual('formattedPrice').get(function () {
  return `${this.price.toFixed(0)} EGP`;
});

const Product = mongoose.model('Product', productSchema);
export default Product;
