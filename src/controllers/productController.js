// src/controllers/productController.js
const prisma = require('../models/prismaClient') // Asegúrate de que Prisma Client esté configurado

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    
    // Devuelve JSON si está en modo de prueba
    if (process.env.NODE_ENV === 'test') {
      return res.json(products)
    }
    
    // Renderiza para el entorno de producción
    res.render('products/index', { products })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Error al obtener productos:', error)
    }
    res.status(500).send('Error al obtener productos')
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) {
      return res.status(400).send('ID de producto inválida')
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    
    if (!product) {
      return res.status(404).send('Producto no encontrado')
    }

    // Devuelve JSON en modo de prueba
    if (process.env.NODE_ENV === 'test') {
      return res.json(product)
    }

    res.render('products/show', { product })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Error al obtener el producto:', error)
    }
    res.status(500).send('Error al obtener el producto')
  }
}

const renderCreateProductForm = (req, res) => {
  res.render('products/form', { product: null }) // Renderizamos el formulario vacío
}

const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body
    await prisma.product.create({
      data: { name, description, price: parseFloat(price) },
    })
    res.redirect('/products')
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al crear producto:', error)
    }
    res.status(500).send('Error al crear producto')
  }
}

const renderEditProductForm = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (product) {
      res.render('products/form', { product }) // Renderizamos el formulario con los datos del producto a editar
    } else {
      res.status(404).send('Producto no encontrado')
    }
  } catch (error) {
    console.error('Error al obtener el producto para editar:', error)
    res.status(500).send('Error al obtener el producto para editar')
  }
}

const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { name, description, price } = req.body
    await prisma.product.update({
      where: { id: productId },
      data: { name, description, price: parseFloat(price) },
    })
    res.redirect('/products')
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Error al actualizar producto:', error)
    }
    res.status(500).send('Error al actualizar producto')
  }
}

const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    await prisma.product.delete({ where: { id: productId } })
    res.redirect('/products')
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Error al eliminar producto:', error)
    }
    res.status(500).send('Error al eliminar producto')
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  renderCreateProductForm,
  createProduct,
  renderEditProductForm,
  updateProduct,
  deleteProduct,
}
