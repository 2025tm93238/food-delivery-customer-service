const express = require("express");
const validate = require("../middleware/validate");
const { updateAddress } = require("../validators/address.validator");
const ctrl = require("../controllers/address.controller");

const router = express.Router();

router.get("/:id", ctrl.getById);
router.put("/:id", validate(updateAddress), ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
