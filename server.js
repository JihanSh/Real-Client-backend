import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./Routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import { adminAuth, userAuth } from "./middleware/Auth.js";
import productRouter from './Routes/productRoute.js';
import subcategoriesRoute from './Routes/subcategoryRoute.js';
import orderRoutes from './routes/ordersRoutes.js'
import bodyParser from "body-parser";
import categoriesRoute from './Routes/Categories.js';
import cartRoute from './Routes/Cart.js';



dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

const app = new express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development"){
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/api/", router);
app.use(cookieParser());

app.get('/', (req, res) => {
   res.send('API is running...')
});
app.use("/orders", orderRoutes);

// calling routes 



