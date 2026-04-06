const express = require("express")
const  router = express.Router()
const tasks = require("../tasks.json")

 
// router.set or app.set should be used for view engine, not router.get

router.get("/users", (req, res) => {
    res.send(tasks)

})


router.get("/users/new", (req, res) => {
    res.send("user new Form")

})

module.exports = router