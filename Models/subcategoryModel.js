import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;