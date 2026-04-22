const addressService = require("../services/address.service");
const { success } = require("../utils/response");
const { parsePagination } = require("../utils/pagination");

const create = async (req, res) => {
  const customer_id = parseInt(req.params.customerId);
  const address = await addressService.create(customer_id, req.body);
  success(req, res, address, 201);
};

const listByCustomer = async (req, res) => {
  const customer_id = parseInt(req.params.customerId);
  const { page, limit, skip } = parsePagination(req.query);
  const { city } = req.query;
  const result = await addressService.listByCustomer(customer_id, {
    page,
    limit,
    skip,
    filters: { city },
  });
  success(req, res, result);
};

const getById = async (req, res) => {
  const address_id = parseInt(req.params.id);
  const address = await addressService.getById(address_id);
  success(req, res, address);
};

const update = async (req, res) => {
  const address_id = parseInt(req.params.id);
  const address = await addressService.update(address_id, req.body);
  success(req, res, address);
};

const remove = async (req, res) => {
  const address_id = parseInt(req.params.id);
  const result = await addressService.remove(address_id);
  success(req, res, result);
};

module.exports = { create, listByCustomer, getById, update, remove };
