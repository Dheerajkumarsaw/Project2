const express = require("express");
const bodyParser = require("body-parser");
const route = require("./route/router");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://dheerubhai2000:gqG*2JVkTEt5T*G@cluster0.hk6qb.mongodb.net/group1Database-DB", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is Connected"))
    .catch(err => console.log(err))

app.use("/", route)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app Running on Port " + (process.env.PORT || 3000))
});