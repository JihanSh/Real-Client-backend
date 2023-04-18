import { response } from "express";
import Product from "../Models/productModel.js";
import path from "path";


class Controller {
  //get all the products
  //.populate({path: 'category', select: 'title'})
  async getAll(req, res) {
    try {
      const products = await Product.find()
        .populate({ path: "subcategory", select: "title" })
        .populate({ path: "category", select: "title" });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  //get all product by pagination

  // async getPagination(req, res) {
  //   try {
  //     const page = req.query.page ? parseInt(req.query.page) : 1; // current page, default to 1 if not provided
  //     const perPage = 6; // number of products to show per page

  //     const productsCount = await Product.countDocuments();
  //     const products = await Product.find().skip((page - 1) * perPage).limit(perPage);
  //     console.log("jjjjj",skip);
  //     console.log("ssss",perPage);
  //     res.status(200).json({
  //       currentPage: page,
  //       totalPages: Math.ceil(productsCount / perPage),
  //       products,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  async getPagination(req, res) {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    // Count the total number of products
    const count = await Product.countDocuments();
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);
  
    res.status(200).json({
      results: products.length,
      page,
      totalPages, // Add totalPages to the response object
      data: products,
    });
  }
  //get a product by id
  async get(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id)
        .populate({ path: "subcategory", select: "title" })
        .populate({ path: "category", select: "title" });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // creating new product
  async post(req, res) {
    try {
      const {
        name,
        description,
        category,
        subcategory,
        price,
        discountPercentage,
        size,
        quantity,
        main_image,
      } = req.body;
      
      let images = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const filePath = path.join("uploads", file.filename);
          images.push(filePath);
        }
      }

      const product = new Product({
        name,
        images: images.length > 0 ? images : undefined,
        description,
        category,
        subcategory,
        price,
        discountPercentage,
        size,
        quantity,
        main_image,
      });

      const savedProduct = await product.save();
      const discountedPrice = savedProduct.getDiscountedPrice();
      res.status(201).json({ product: savedProduct, discountedPrice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //update a product by _id
  async put(req, res, next) {
    let { id } = req.params;
    let {
      name,
      description,
      category,
      subcategory,
      price,
      discountPercentage,
      size,
      quantity,
      main_image,
    } = req.body;
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          name,
          description,
          category,
          subcategory,
          price,
          discountPercentage,
          size,
          quantity,
          main_image,
        },
        { new: true, runValidators: true }
      );

      // Update discounted price
      product.discountedPrice = product.getDiscountedPrice();
      await product.save();

      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }

  //delete a product by id
  async delete(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findOne({ _id: id });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // grt products by subcategory name

  async getProductsBySubcategory(req, res) {
    console.log("hello");

    const subcategoryId = req.params.id;
    console.log("subcategoryId: ", subcategoryId);
    try {
      const products = await Product.find({
        subcategory: subcategoryId,
      });
      console.log("kkkk", products);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // grt products by category name

  async getProductsByCategory(req, res) {
    console.log("hello");

    const categoryId = req.params.id;
    console.log("categoryId: ", categoryId);
    try {
      const products = await Product.find({
        category: categoryId,
      });
      console.log("kkkk", products);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  search about product

  async search(req, res) {
    try {
      const searchQuery = req.query.q || "";
      const page = req.query.page ? parseInt(req.query.page) : 1; // current page, default to 1 if not provided
      const perPage = 6; // number of products to show per page

      const productsCount = await Product.countDocuments({
        name: { $regex: searchQuery, $options: "i" },
      });
      const products = await Product.find({
        name: { $regex: searchQuery, $options: "i" },
      })
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(productsCount / perPage),
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const controller = new Controller();

export default controller;
