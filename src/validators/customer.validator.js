const Joi = require("joi");

const createCustomer = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().trim().pattern(/^\d{10}$/).required(),
});

const updateCustomer = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  email: Joi.string().trim().lowercase().email(),
  phone: Joi.string().trim().pattern(/^\d{10}$/),
}).min(1);

module.exports = { createCustomer, updateCustomer };
