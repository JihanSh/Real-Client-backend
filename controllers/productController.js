import { response } from "express";
import Product from "../models/productModel.js";

class Controller {
  //get all the products
  async getAll(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //get a product by id
  async get(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);
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
  // async post(req, res) {
  //   const { name, description, category, price, size, quantity } = req.body;

  //   const newProduct = new Product({
  //     name,
  //     description,
  //     category,
  //     price,
  //     size,
  //     quantity,
  //     date_added: Date.now(),
  //   });

  //   try {
  //     const createdProduct = await newProduct.save();
  //     res.status(201).json(createdProduct);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }

  async post(req, res) {
    try {
      const { name, description, category, price, size, quantity, main_image } = req.body;
      const images = req.files.map((file) => file.filename);
  
      const product = new Product({
        name,
        images,
        description,
        category,
        price,
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
}

const controller = new Controller();

export default controller;
