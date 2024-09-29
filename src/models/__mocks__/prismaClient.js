// src/models/__mocks__/prismaClient.js
const mockPrisma = {
    product: {
      findMany: jest.fn().mockResolvedValue([
        { id: 1, name: "Producto 1", description: "Descripción 1", price: 100 },
        { id: 2, name: "Producto 2", description: "Descripción 2", price: 200 },
      ]),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 999) { // Simula un caso de error
          return null;
        }
        return { id: where.id, name: "Producto de prueba", description: "Descripción de prueba", price: 100 };
      }),
      create: jest.fn().mockResolvedValue({ id: 3, name: "Nuevo Producto", description: "Descripción", price: 300 }),
      update: jest.fn().mockResolvedValue({ id: 1, name: "Producto Actualizado", description: "Actualizado", price: 150 }),
      delete: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 999) {
          throw new Error("Error de base de datos"); // Simula un error al eliminar
        }
        return { id: where.id };
      }),
    },
  }
  
  module.exports = mockPrisma;
  