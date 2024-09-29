const { deleteProduct } = require('../../controllers/productController');
const prisma = require('../../models/prismaClient');

jest.mock('../../models/prismaClient');

describe('deleteProduct', () => {
  let createdProductId; // Variable para almacenar el ID del producto creado

  beforeEach(async () => {
    // Simulamos la creación de un producto antes de cada prueba
    const createdProduct = { id: 123, name: 'Producto de prueba', description: 'Descripción', price: 19.99 };
    prisma.product.create = jest.fn().mockResolvedValue(createdProduct);

    // Simula la creación del producto
    const reqCreate = {
      body: { name: 'Producto de prueba', description: 'Descripción', price: 19.99 },
    };
    
    // const resCreate = {
    //   redirect: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn(),
    // };

    await prisma.product.create(reqCreate.body);
    createdProductId = createdProduct.id; // Asigna el ID del producto recién creado
  });

  it('debería eliminar un producto y redirigir', async () => {
    // Usar el ID del producto creado
    const req = { params: { id: createdProductId.toString() } }; 
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    prisma.product.delete.mockResolvedValue({ id: createdProductId });

    await deleteProduct(req, res);

    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: createdProductId } });
    expect(res.redirect).toHaveBeenCalledWith('/products');
  });

  it('debería manejar el error cuando la eliminación falla', async () => {
    // Usar el ID del producto creado
    const req = { params: { id: createdProductId.toString() } };
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    prisma.product.delete.mockRejectedValue(new Error('Error de base de datos'));

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error al eliminar producto');
  });
});
