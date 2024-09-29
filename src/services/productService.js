// src/services/productService.js
const prisma = require('../models/prismaClient');

const getAll = async () => {
    return prisma.product.findMany();
};

const getById = async (id) => {
    return prisma.product.findUnique({ where: { id: parseInt(id) } });
};

const create = async (data) => {
    return prisma.product.create({ data });
};

module.exports = { getAll, getById, create };
