const express = require("express")
const  router = express.Router()
const tasks = require("../tasks.json")

 
router.get("view engine", "ejs")

router.get("/users", (req, res) => {
    res.send(tasks)

})


router.get("/users/new", (req, res) => {
    res.send("user new Form")

})

module.exports = router