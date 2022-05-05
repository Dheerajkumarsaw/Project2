const { is } = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const internModel = require("../model/internModel");
const collegeModel = require("../model/collegeModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || typeof value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
};

const createIntern = async function (req, res) {
    try {
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Enter Student Details" });

        const { name, mobile, email, collegeName } = requestBody; //destructuring

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is required" });

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Email is Required" });
        const regx = /^([a-z0-9\._]+)@([a-z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });

        if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Mobile no is required" });
        const valid = mobile.length;
        if (!(valid == 10)) return res.status(400).send({ status: false, message: "Enter Valid Mobile no" });

        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "College Name is Required" });

        const college = await collegeModel.findOne({ name: collegeName });
        if (!college) return res.status(404).send({ status: false, message: `${collegeName} Not Exist Register First` });
        const collegeId = college._id;

        const unique = await internModel.findOne({ email: email, mobile: mobile, collegeId: collegeId });
        if (unique) return res.status(400).send({ status: false, message: "Use Different Email or Password" }); ////change status code

        requestBody["collegeId"] = collegeId;

        const internCreate = await internModel.create(requestBody);
        res.status(201).send({ status: true, message: "Intern created succssfully", data: internCreate })


    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

const collegeDetails = async function (req, res) {
    try {
        const collegeName = req.query.collegeName
        if (Object.keys(collegeName).length === 0) return res.status(400).send({ status: false, message: "Query not Received" });

        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) return res.status(404).send({ status: false, message: `${collegeName} Not Found, Register First` });
        const { name, fullName, logoLink } = college
        const data = { name, fullName, logoLink };
        data["interests"] = [];
        const modelCollegeId = college._id;

        const internList = await internModel.find({ collegeId: modelCollegeId });
        if (internList.length == 0) return res.status(404).send({ status: false, message: `${collegeName} Not Have Any Internship` });
        data["interests"] = [...internList]
        res.status(200).send({ status: true, data: data });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.createIntern = createIntern;
module.exports.collegeDetails = collegeDetails