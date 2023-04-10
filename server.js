import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import cors from 'cors';
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
app.use(cors());

app.get('/', (req, res) => {
   res.send('API is running...')
});


// calling routes 
app.use('/categories', categoriesRoute);
app.use('/cart', cartRoute);



app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`));