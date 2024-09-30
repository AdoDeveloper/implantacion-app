const request = require('supertest');
const express = require('express');
const path = require('path');
const productRoutes = require('../../routes/productRoutes');

const app = express();
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '../../views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/products', productRoutes);

describe('Integración de Productos', () => {
  let createdProductId; // Variable para almacenar el ID del producto creado

  it('Debe obtener todos los productos', async () => {
    const response = await request(app).get('/products');
    try {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true); // Verifica que la respuesta sea un array
      
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
      }
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      process.exit(1); // Código de error para el pipeline
    }
  });

  it('Debe crear un nuevo producto', async () => {
    const newProduct = { name: 'Producto de Prueba', description: 'Descripción de prueba', price: 19.99 };
    const response = await request(app).post('/products').send(newProduct);
    
    try {
      expect(response.statusCode).toBe(302); // Ajusta según la respuesta esperada, por ejemplo si hay un redirect

      // Obtener el ID del producto recién creado
      const productListResponse = await request(app).get('/products');
      expect(productListResponse.statusCode).toBe(200);

      const products = productListResponse.body;
      createdProductId = products[products.length - 1]?.id; // Asigna el ID del último producto creado
      expect(createdProductId).toBeDefined(); // Verifica que el ID esté definido
    } catch (error) {
      console.error('Error al crear un nuevo producto:', error);
      process.exit(1); // Código de error para el pipeline
    }
  });

  it('Debe eliminar un producto', async () => {
    // Verifica que el ID del producto creado esté definido
    expect(createdProductId).toBeDefined();

    try {
      // Usar el ID del último producto creado
      const response = await request(app).post(`/products/${createdProductId}/delete`); // Ajusta la ruta según tu aplicación
      expect(response.statusCode).toBe(302); // Ajusta según la respuesta esperada
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      process.exit(1); // Código de error para el pipeline
    }
  });
});
