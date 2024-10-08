// src/routes/productRoutes.js
const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// Ruta para mostrar el formulario de creación
router.get('/new', productController.renderCreateProductForm)

// Ruta para crear un nuevo producto
router.put('/', productController.createProduct)

// Ruta para listar todos los productos
router.get('/', productController.getAllProducts)

// Ruta para ver un solo producto
router.get('/:id', productController.getProductById)

// Ruta para mostrar el formulario de edición
router.get('/:id/edit', productController.renderEditProductForm)

// Ruta para actualizar un producto (usando PUT)
router.put('/:id', productController.updateProduct)

// Ruta para eliminar un producto
router.post('/:id', productController.deleteProduct)

module.exports = router
