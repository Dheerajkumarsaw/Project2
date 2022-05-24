const collegeModel = require("../model/collegeModel");
const uploadFiles = require("../controller/AWS/aws-s3")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const collegeCreate = async function (req, res) {
    try {
        const requestBody = req.body;
        const requestFiles = req.files
        if (Object.keys(requestBody).length === 0)
            return res.status(400).send({ status: false, message: "Please enter College details" });

        if (!isValid(requestFiles) || requestFiles.length == 0)
            return res.status(400).send({ status: false, message: "Enter file to be Upload" });
        let { name, fullName } = requestBody; //Destructuring

        const unique = await collegeModel.findOne({ name: name });
        if (unique) return res.status(400).send({ status: false, message: "College Allready Exist" })

        if (!isValid(name))
            return res.status(400).send({ status: false, message: "Name is Required" });
        if (!isValid(fullName))
            return res.status(400).send({ status: false, message: "FullName is Required" });

        // if (!isValid(logoLink)) return res.status(400).send({ status: false, message: "LogoLink is required" });
        // const regx = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/+#-]*[\w@?^=%&amp;\/+#-])?/;
        // if (!regx.test(logoLink)) return res.status(400).send({ status: false, message: "Enter Valid Url" })

        //  URL  CREATION   AFTER    SUCCESSFULLY    UPLOADED   ON   AWS S3 
        const uploadedFilesURL = await uploadFiles.uploadFiles(requestFiles[0]);
        requestBody.logoLink = uploadedFilesURL;

        const createCollege = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, message: "College is successfully Created", data: { name: createCollege.name, fullName: createCollege.fullName, logoLink: createCollege.logoLink, isDeleted: createCollege.isDeleted } })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.collegeCreate = collegeCreate