import { response } from "express";
import Product from "../Models/productModel.js";
import Category from "../Models/category.js";



class Controller {
  //get all the products
  //.populate({path: 'category', select: 'title'})
  async getAll(req, res) {
    try {
      const products = await Product.find().populate({path: 'subcategory', select: 'title'}).populate({path: 'category', select: 'title'});;
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
     const page =req.query.page * 1 || 1;
     const limit = req.query.limit * 1 || 6;
     const skip = (page - 1) * limit;
     const products = await Product.find({}).skip(skip).limit(limit);

     res.status(200).json({
      results: products.length, page, data:products
     });
  }

 //get a product by id
  async get(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id).populate({path: 'subcategory', select: 'title'}).populate({path: 'category', select: 'title'});;
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
      const { name, description, category,subcategory, price, priceAfterDiscount, size, quantity, main_image } = req.body;
      const images = req.files.map((file) => file.filename);
  
      const product = new Product({
        name,
        images,
        description,
        category,
        subcategory,
        price,
        priceAfterDiscount,
        size,
        quantity,
        main_image
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  //update a product by _id
  put(req, res, next) {
    let { id } = req.params;
    let body = req.body;
    Product.updateOne({ _id: id }, { $set: body })
      .then((response) => {
        res.status(200).send({ success: true, response });
      })
      .catch((err) => {
        return next(err);
      });
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
    console.log("subcategoryId: ", subcategoryId)
    try {
      const products = await Product.find({ 
        subcategory: subcategoryId 
      });
      console.log("kkkk", products)
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

    // grt products by category name

    async getProductsByCategory(req, res) {
      console.log("hello");
      
      const categoryId = req.params.id;
      console.log("categoryId: ", categoryId)
      try {
        const products = await Product.find({ 
          category: categoryId 
        });
        console.log("kkkk", products)
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
  
      const productsCount = await Product.countDocuments({ name: { $regex: searchQuery, $options: "i" } });
      const products = await Product.find({ name: { $regex: searchQuery, $options: "i" } })
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
