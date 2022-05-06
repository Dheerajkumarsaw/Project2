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

        let { name, mobile, email, collegeName } = requestBody; //destructuring
        // validations
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is required" });
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Email is Required" });
        const regx = /^([a-z0-9\._]+)@([a-z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });

        if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Mobile no is required" });
        const mobileRegx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        if (!mobileRegx.test(mobile)) return res.status(400).send({ status: false, message: "Enter Valid Mobile no" })
        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "College Name is Required" });
        //end
        const college = await collegeModel.findOne({ name: collegeName });
        if (!college) return res.status(404).send({ status: false, message: `${collegeName} Not Exist Register First` });
        const collegeId = college._id;

        const uniqueE = await internModel.findOne({ email: email }); //checking unique by email
        const uniqueM = await internModel.findOne({ mobile: mobile }) //checking unique by mobile
        if (uniqueE) return res.status(400).send({ status: false, message: "Use Different Email " }); 
        if (uniqueM) return res.status(400).send({ status: false, message: "Use Different Mobile No" });

        requestBody["collegeId"] = collegeId;
        const internCreate = await internModel.create(requestBody);
        res.status(201).send({
            status: true, message: "Intern created succssfully",
            data: { isDeleted: internCreate.isDeleted, name: internCreate.name, email: internCreate.email, mobile: internCreate.mobile, collegeId: internCreate.collegeId }
        })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

const collegeDetails = async function (req, res) {
    try {
        const collegeName = req.query.collegeName
        if (!collegeName) return res.status(400).send({ status: false, message: "Query not Received" });

        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) return res.status(404).send({ status: false, message: `${collegeName} Not Found, Register First` });
        const { name, fullName, logoLink } = college
        const data = { name, fullName, logoLink };
        data["interests"] = [];
        const modelCollegeId = college._id;

        const internList = await internModel.find({ collegeId: modelCollegeId }).select({ _id: 1, name: 1, email: 1, mobile: 1 });

        if (internList.length == 0) return res.status(404).send({ status: false, message: `${collegeName} Not Have Any Internship` });
        data["interests"] = [...internList]
        res.status(200).send({ status: true, data: data });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.createIntern = createIntern;
module.exports.collegeDetails = collegeDetails

