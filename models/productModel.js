import mongoose from "mongoose";
const {Schema, model} = mongoose;

const productSchema = new Schema (
    {
        name: {
            type: String,
            required: [true, "Please include the product name"],
        },
        images: [{
            type: String,
            required: true
        }],
        description: {
            type: String,
            required: true
        },
        category:{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, "Please include the product category"],
        },
        price: {
            type: Number,
            required: [true, "Please include the product price"],
        },
        size: {
            type: String,
            required: [true, "Please include the product size"],
        },
        quantity: {
            type: Number,
            required: [true, "Please include the product quantity"],
            min: [1, 'Quantity can not be less then 1.']
        },
        date_added: {
            type: Date,
            default: Date.now
        },
        main_image: {
            type: Number,
            required: true,
            default: 0 // the index of the first image is the default main image
        }
    }
);
const Product = model ('Product', productSchema);
export default Product;