import Cart from "../Models/Cart.js";
import Product from "../Models/productModel.js";

export const getCartItems = async (req, res) => {
    const userId = req.params.id;
    try{
        let cart = await Cart.findOne({userId});
        if(cart && cart.items.length > 0){
            res.send(cart);
        }
        else{
            res.send(null);
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
 
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
  
      const price = product.price;
      const name = product.title;
  
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
          let productItem = cart.items[itemIndex];
          productItem.quantity += 1;
          cart.items[itemIndex] = productItem;
        } else {
          cart.items.push({ productId, name, price, quantity: 1 });
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
  console.log(productId)
  try {
      let cart = await Cart.findOne({ userId });
      let itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
      if (itemIndex > -1) {
          let productItem = cart.items[itemIndex];
          if (!isNaN(productItem.price)) {
              cart.bill -= productItem.price;
          }
          cart.items.splice(itemIndex, 1);
      }
      cart = await cart.save();
      console.log('hello', cart);
      return res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};