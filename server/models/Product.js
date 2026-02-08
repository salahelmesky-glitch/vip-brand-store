const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        required: true
    },
    nameAr: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['men', 'women'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 10
    },
    sold: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isLimited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
