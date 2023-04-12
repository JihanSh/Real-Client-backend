import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please include the product name"],
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please include the product category"],
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: [true, "Please include the product subcategory"],
  },
  price: {
    type: Number,
    required: [true, "Please include the product price"],
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    required: [true, "Please include the product size"],
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  main_image: {
    type: Number,
    required: true,
    default: 0, // the index of the first image is the default main image
  },
});

productSchema.methods.getDiscountedPrice = function () {
  const discountAmount = (this.price * this.discountPercentage) / 100;
  return this.price - discountAmount;
};
productSchema.pre("save", function () {
  this.discountedPrice = this.getDiscountedPrice();
});
const Product = model("Product", productSchema);
export default Product;
