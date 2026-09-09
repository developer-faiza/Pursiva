require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('./config/db');

const ownerRouter = require('./routes/ownerRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoute');

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/owner', ownerRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
