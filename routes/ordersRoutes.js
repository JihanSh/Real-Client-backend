import express from 'express';
const router = express.Router();

import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
  } from '../controllers/ordersController.js';


  router.get('/', getAllOrders);


  router.get('/:id', getOrderById);
  
  router.post('/', createOrder);
  
  router.patch('/:id', updateOrderStatus);
  

  export default router;