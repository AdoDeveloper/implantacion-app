const { createProduct } = require('../../controllers/productController');
const prisma = require('../../models/prismaClient');

jest.mock('../../models/prismaClient');

describe('createProduct', () => {
  it('debería crear un producto y redirigir', async () => {
    const req = {
      body: {
        name: 'Nuevo Producto',
        description: 'Descripción de prueba',
        price: '19.99',
      },
    };
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    prisma.product.create.mockResolvedValue({ id: 1, ...req.body });

    await createProduct(req, res);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: { name: 'Nuevo Producto', description: 'Descripción de prueba', price: 19.99 },
    });
    expect(res.redirect).toHaveBeenCalledWith('/products');
  });

  it('debería manejar el error cuando la creación falla', async () => {
    const req = {
      body: {
        name: 'Nuevo Producto',
        description: 'Descripción de prueba',
        price: '19.99',
      },
    };
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    prisma.product.create.mockRejectedValue(new Error('Error de base de datos'));

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error al crear producto');
  });
});
