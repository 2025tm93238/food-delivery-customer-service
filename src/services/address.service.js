const Address = require("../models/Address");
const Customer = require("../models/Customer");
const { errors } = require("../utils/errors");

const getNextId = async () => {
  const last = await Address.findOne().sort({ address_id: -1 }).select("address_id").lean();
  return (last?.address_id ?? 0) + 1;
};

const ensureCustomer = async (customer_id) => {
  const exists = await Customer.exists({ customer_id });
  if (!exists) {
    throw errors.notFound("CUSTOMER_NOT_FOUND", `Customer ${customer_id} not found`);
  }
};

const create = async (customer_id, data) => {
  await ensureCustomer(customer_id);
  const address_id = await getNextId();
  const doc = await Address.create({
    address_id,
    customer_id,
    ...data,
    created_at: new Date(),
  });
  return doc.toObject();
};

const listByCustomer = async (customer_id, { page, limit, skip, filters }) => {
  await ensureCustomer(customer_id);
  const query = { customer_id };
  if (filters.city) query.city = new RegExp(filters.city, "i");

  const [items, total] = await Promise.all([
    Address.find(query).sort({ address_id: 1 }).skip(skip).limit(limit).lean(),
    Address.countDocuments(query),
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

const getById = async (address_id) => {
  const address = await Address.findOne({ address_id }).lean();
  if (!address) {
    throw errors.notFound("ADDRESS_NOT_FOUND", `Address ${address_id} not found`);
  }
  return address;
};

const update = async (address_id, data) => {
  const updated = await Address.findOneAndUpdate(
    { address_id },
    { $set: data },
    { new: true }
  ).lean();
  if (!updated) {
    throw errors.notFound("ADDRESS_NOT_FOUND", `Address ${address_id} not found`);
  }
  return updated;
};

const remove = async (address_id) => {
  const deleted = await Address.findOneAndDelete({ address_id });
  if (!deleted) {
    throw errors.notFound("ADDRESS_NOT_FOUND", `Address ${address_id} not found`);
  }
  return { address_id, deleted: true };
};

module.exports = { create, listByCustomer, getById, update, remove };
