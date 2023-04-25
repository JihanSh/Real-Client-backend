import { response } from "express";
import Product from "../Models/productModel.js";
import Category from "../Models/Categories.js";
import Subcategory from "../Models/subcategoryModel.js";
import path from "path";
import fs from "fs";


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
    const products = await Product.find({})
    .sort({ date_added: -1 }) // Sort products by the createdAt field in descending order
    .skip(skip)
    .limit(limit);
  
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
        categoryTitle,
        subcategoryTitle,
        price,
        discountPercentage,
        size,
        main_image,
      } = req.body;
      
      let images = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const filePath = path.join("uploads", file.filename);
          images.push(filePath);
        }
      }

      // Find the category by its title
      const category = await Category.findOne({ title: categoryTitle });

      // Find the subcategories that belong to the selected category
      const subcategories = await Subcategory.find({ category: category.id });

      // Find the specific subcategory by its title within the subcategories array
      const subcategory = subcategories.find(sub => sub.title === subcategoryTitle);

      const product = new Product({
        name,
        images: images.length > 0 ? images : undefined,
        description,
        category: category.id,
        subcategory: subcategory._id,
        categoryTitle: category.title,
        subcategoryTitle: subcategory.title,
        price,
        discountPercentage,
        size,
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


  // async post(req, res) {
  //   try {
  //     const {
  //       name,
  //       description,
  //       category,
  //       subcategory,
  //       price,
  //       discountPercentage,
  //       size,
  //       main_image,
  //     } = req.body;
      
  //     let images = [];
  //     if (req.files && req.files.length > 0) {
  //       for (const file of req.files) {
  //         const filePath = path.join("uploads", file.filename);
  //         images.push(filePath);
  //       }
  //     }

  //     const product = new Product({
  //       name,
  //       images: images.length > 0 ? images : undefined,
  //       description,
  //       category,
  //       subcategory,
  //       price,
  //       discountPercentage,
  //       size,
      
  //       main_image,
  //     });

  //     const savedProduct = await product.save();
  //     const discountedPrice = savedProduct.getDiscountedPrice();
  //     res.status(201).json({ product: savedProduct, discountedPrice });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }

  //update a product by _id


  // async put(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { name, description, price, discountPercentage, size, category, subcategory } =
  //       req.body;
  //     const images = req.files;
  
  //     // Find the product by ID
  //     const product = await Product.findById(id);
  
  //     if (!product) {
  //       return res.status(404).json({ message: "Product not found" });
  //     }
  //     console.log("jjjj", product)
  //     // Delete old images if there are new images
  //     if (images && images.length > 0) {
  //       product.images.forEach((imagePath) => {
  //         fs.unlinkSync(`${imagePath}`);
  //       });
  //     }
     
  //     // Update fields with new values
  //     product.name = name;
  //     console.log("gggg",name)
  //     product.description = description;
  //     product.price = price;
  //     console.log("ggggsasdad",price)
  //     product.discountPercentage = discountPercentage;
  //     product.size = size;
  //     product.category = category;
  //     product.subcategory = subcategory;
  
  //     // Update images if there are new images, otherwise keep existing images
  //     if (!images || images.length === 0) {
  //       product.images = [];
  //     } else {
  //       product.images = images.map((image) => image.filename);
  //     }
  
  //     // Update discounted price
  //     product.discountedPrice = product.getDiscountedPrice();
  
  //     // Save the updated product to the database
  //     await product.save();
  
  //     res.status(200).json(product);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: "Server Error" });
  //   }
  // };

  async put(req, res) {
    try {
    const {
    name,
    description,
    categoryTitle,
    subcategoryTitle,
    price,
    discountPercentage,
    size,
    main_image,
    } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filePath = path.join("uploads", file.filename);
        images.push(filePath);
      }
    }
    
     // Find the category by its title
     const category = await Category.findOne({ title: categoryTitle });

     // Find the subcategories that belong to the selected category
     const subcategories = await Subcategory.find({ category: category._id });

     // Find the specific subcategory by its title within the subcategories array
     const subcategory = subcategories.find(sub => sub.title === subcategoryTitle);

    const productId = req.params.id;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    product.name = name || product.name;
    product.images = images.length > 0 ? images : product.images;
    product.description = description || product.description;
    product.category = category._id || product.category._id;
    product.subcategory = subcategory._id || product.subcategory._id;
    product.categoryTitle = category.title || product.category.title;
    product.subcategoryTitle = subcategory.title || product.subcategory.title;
    product.price = price || product.price;
    product.discountPercentage = discountPercentage || product.discountPercentage;
    product.size = size || product.size;
    
    product.main_image = main_image || product.main_image;
    
    const savedProduct = await product.save();
    const discountedPrice = savedProduct.getDiscountedPrice();
    res.json({ product: savedProduct, discountedPrice });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    const subcategoryId = req.params.id;
    // Count the total number of products
    const count = await Product.countDocuments({ subcategory: subcategoryId });
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    console.log("subcategoryId: ", subcategoryId);
    try {
      const products = await Product.find({
        subcategory: subcategoryId,
      }).sort({ date_added: -1 }).skip(skip).limit(limit);
      console.log("kkkk", products);
      res.status(200).json({
        results: products.length,
        page,
        totalPages, // Add totalPages to the response object
        data: products,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // grt products by category name

  async getProductsByCategory(req, res) {
    console.log("hello");
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    const categoryId = req.params.id;
    // Count the total number of products
    const count = await Product.countDocuments({ category: categoryId });
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    console.log("categoryId: ", categoryId);
    try {
      const products = await Product.find({
        category: categoryId,
      }).sort({ date_added: -1 }).skip(skip).limit(limit);
      console.log("kkkk", products);
      res.status(200).json({
        results: products.length,
        page,
        totalPages, // Add totalPages to the response object
        data: products,
      });
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
