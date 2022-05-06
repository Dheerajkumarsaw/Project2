const express = require("express");
const router = express.Router();
const collegeController = require("../controller/collegeController")
const internController = require("../controller/internController");


router.post("/functionup/colleges", collegeController.collegeCreate);

router.post("/functionup/interns", internController.createIntern);

router.get("/functionup/collegeDetails", internController.collegeDetails)

module.exports = router