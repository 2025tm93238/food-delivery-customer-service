const customerService = require("../services/customer.service");
const { success } = require("../utils/response");
const { parsePagination } = require("../utils/pagination");

const create = async (req, res) => {
  const customer = await customerService.create(req.body);
  success(req, res, customer, 201);
};

const list = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { email, phone, name } = req.query;
  const result = await customerService.list({
    page,
    limit,
    skip,
    filters: { email, phone, name },
  });
  success(req, res, result);
};

const getById = async (req, res) => {
  const customer_id = parseInt(req.params.id);
  const customer = await customerService.getById(customer_id);
  success(req, res, customer);
};

const update = async (req, res) => {
  const customer_id = parseInt(req.params.id);
  const customer = await customerService.update(customer_id, req.body);
  success(req, res, customer);
};

const remove = async (req, res) => {
  const customer_id = parseInt(req.params.id);
  const result = await customerService.remove(customer_id);
  success(req, res, result);
};

module.exports = { create, list, getById, update, remove };
