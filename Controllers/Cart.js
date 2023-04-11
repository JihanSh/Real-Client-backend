import Cart from "../Models/Cart.js";
import Product from "../Models/Product.js";

export const getCartItems = async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.items.length > 0) {
      res.send(cart);
    } else {
      res.send(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

export const addCartItem = async (req, res) => {
  const userId = req.params.id;
  const productId = req.body.productId;
  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }
    let price;
    if (product.discountPercentage > 0) {
      price = product.discountedPrice;
    } else {
      price = product.price;
    }
    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: [{ productId }],
        bill: price,
      });
      return res.status(201).send(newCart);
    } else {
      let itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId.toString()
      );
      if (itemIndex > -1) {
        return res.send("Product already exists in cart.");
      } else {
        cart.items.push({ productId });
      }
      cart.bill += price;
      cart = await cart.save();
      return res.status(201).send(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

export const deleteItem = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  console.log(productId);
  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });
    let itemIndex = cart.items.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart.bill -= product.price;
    }
    cart = await cart.save();
    // console.log("hello", cart);
    return res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
