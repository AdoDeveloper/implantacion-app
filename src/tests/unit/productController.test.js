// src/tests/unit/productController.test.js
const { getAllProducts } = require('../../controllers/productController');
const prisma = require('../../models/prismaClient');

jest.mock('../../models/prismaClient');

describe('getAllProducts', () => {
  it('debería obtener todos los productos y devolver JSON en modo de prueba', async () => {
    // Mock de datos de productos
    const mockProducts = [
      { id: 1, name: 'Product 1', description: 'Descripción 1', price: 10 },
      { id: 2, name: 'Product 2', description: 'Descripción 2', price: 20 },
    ];

    prisma.product.findMany.mockResolvedValue(mockProducts);

    // Mock de req y res
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Ejecutar la función
    await getAllProducts(req, res);

    // Verifica que se llamó a res.json con los datos correctos
    expect(prisma.product.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });

  it('debería manejar el error cuando la consulta falla', async () => {
    prisma.product.findMany.mockRejectedValue(new Error('Database error'));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error al obtener productos');

    // Lanzar un error explícito si la prueba falla para que el pipeline CI/CD lo detecte
    if (res.status.mock.calls[0][0] !== 500) {
      console.error('Error: Se esperaba un estado 500 pero no se recibió');
      process.exit(1); // Código de error para el pipeline
    }
  });
});
