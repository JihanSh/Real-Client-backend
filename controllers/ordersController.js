import Order from "../models/ordersModel.js";
// import Cart from "../models/cart.js";

// create a new order based on the user's cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    // create a new order based on the cart's products
    const order = new Order({
      user: userId,
      products: cart.products.map((item) => ({
        product: {
            _id: item.product._id,
            name: item.product.name
          },
      quantity: item.quantity
      })),
      total_price: cart.total_price
    });

    // save the order to the database
    const savedOrder = await order.save();

    // clear the user's cart
    await cart.remove();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name address phone').select('timestamps');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email address phone');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// update the status of an order
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
}