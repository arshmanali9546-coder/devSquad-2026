const express = require("express")
const  router = express.Router()


router.get("view engine", "ejs")
router.get("/users", (req, res) => {
    res.send("User List")

})


router.get("/users/new", (req, res) => {
    res.send("user new Form")

})

