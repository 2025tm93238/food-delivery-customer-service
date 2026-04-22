const Customer = require("../models/Customer");
const Address = require("../models/Address");
const { errors } = require("../utils/errors");

const getNextId = async () => {
  const last = await Customer.findOne().sort({ customer_id: -1 }).select("customer_id").lean();
  return (last?.customer_id ?? 0) + 1;
};

const create = async (data) => {
  const existing = await Customer.findOne({ email: data.email }).lean();
  if (existing) {
    throw errors.conflict("CUSTOMER_EMAIL_EXISTS", "Customer with this email already exists");
  }
  const customer_id = await getNextId();
  const doc = await Customer.create({
    customer_id,
    ...data,
    created_at: new Date(),
  });
  return doc.toObject();
};

const list = async ({ page, limit, skip, filters }) => {
  const query = {};
  if (filters.email) query.email = filters.email.toLowerCase();
  if (filters.phone) query.phone = filters.phone;
  if (filters.name) query.name = new RegExp(filters.name, "i");

  const [items, total] = await Promise.all([
    Customer.find(query).sort({ customer_id: 1 }).skip(skip).limit(limit).lean(),
    Customer.countDocuments(query),
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

const getById = async (customer_id) => {
  const customer = await Customer.findOne({ customer_id }).lean();
  if (!customer) {
    throw errors.notFound("CUSTOMER_NOT_FOUND", `Customer ${customer_id} not found`);
  }
  return customer;
};

const update = async (customer_id, data) => {
  if (data.email) {
    const clash = await Customer.findOne({
      email: data.email,
      customer_id: { $ne: customer_id },
    }).lean();
    if (clash) {
      throw errors.conflict("CUSTOMER_EMAIL_EXISTS", "Customer with this email already exists");
    }
  }
  const updated = await Customer.findOneAndUpdate(
    { customer_id },
    { $set: data },
    { new: true }
  ).lean();
  if (!updated) {
    throw errors.notFound("CUSTOMER_NOT_FOUND", `Customer ${customer_id} not found`);
  }
  return updated;
};

const remove = async (customer_id) => {
  const deleted = await Customer.findOneAndDelete({ customer_id });
  if (!deleted) {
    throw errors.notFound("CUSTOMER_NOT_FOUND", `Customer ${customer_id} not found`);
  }
  await Address.deleteMany({ customer_id });
  return { customer_id, deleted: true };
};

module.exports = { create, list, getById, update, remove };
