import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import cors from 'cors';
import orderRoutes from './routes/ordersRoutes.js'

dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

const app = new express();

if (process.env.NODE_ENV === "development"){
   app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send('API is running...')
});


// calling routes 
app.use('/api/orders', orderRoutes)



app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`));