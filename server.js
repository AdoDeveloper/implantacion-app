// server.js
const express = require('express')
const methodOverride = require('method-override')
const path = require('path')
const productRoutes = require('./src/routes/productRoutes')

const app = express()

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// Middleware para manejar datos de formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configurar method-override para soportar PUT y DELETE en formularios
app.use(methodOverride('_method'))

// Configurar directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Usar las rutas de productos
app.use('/products', productRoutes)

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
