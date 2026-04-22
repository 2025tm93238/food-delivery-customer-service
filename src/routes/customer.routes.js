const express = require("express");
const validate = require("../middleware/validate");
const {
  createCustomer,
  updateCustomer,
} = require("../validators/customer.validator");
const { createAddress } = require("../validators/address.validator");
const customerCtrl = require("../controllers/customer.controller");
const addressCtrl = require("../controllers/address.controller");

const router = express.Router();

router.post("/", validate(createCustomer), customerCtrl.create);
router.get("/", customerCtrl.list);
router.get("/:id", customerCtrl.getById);
router.put("/:id", validate(updateCustomer), customerCtrl.update);
router.delete("/:id", customerCtrl.remove);

router.post(
  "/:customerId/addresses",
  validate(createAddress),
  addressCtrl.create
);
router.get("/:customerId/addresses", addressCtrl.listByCustomer);

module.exports = router;
