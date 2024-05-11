const router = require("express").Router();
const departments = require("./departments");

router.use("/depts", departments);
// router.use("/employees", employees);
// router.use("/roles", roles);

module.exports = router;
