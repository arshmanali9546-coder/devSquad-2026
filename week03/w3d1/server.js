const express = require("express")
const  app = express()





app.get("/", (req, res) => {
    console.log("Here")
    // res.download("server.js")
    res.render('index', {text: "world"})
})



app.listen(3000)

