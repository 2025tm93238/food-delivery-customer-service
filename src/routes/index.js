const express = require("express");
const customerRoutes = require("./customer.routes");
const addressRoutes = require("./address.routes");

const router = express.Router();

router.use("/customers", customerRoutes);
router.use("/addresses", addressRoutes);

module.exports = router;
