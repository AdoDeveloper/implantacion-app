// src/app.js
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productRoutes);

module.exports = app;
