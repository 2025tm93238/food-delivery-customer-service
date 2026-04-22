const Joi = require("joi");

const createAddress = Joi.object({
  line1: Joi.string().trim().min(1).max(200).required(),
  area: Joi.string().trim().max(100).allow("", null),
  city: Joi.string().trim().min(1).max(100).required(),
  pincode: Joi.string().trim().pattern(/^\d{6}$/).allow("", null),
});

const updateAddress = Joi.object({
  line1: Joi.string().trim().min(1).max(200),
  area: Joi.string().trim().max(100).allow("", null),
  city: Joi.string().trim().min(1).max(100),
  pincode: Joi.string().trim().pattern(/^\d{6}$/).allow("", null),
}).min(1);

module.exports = { createAddress, updateAddress };
