const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    //15 min
    windowMs : 15*60*1000,
    max: 100, //100 requests
    message: "Too many requests. Please try after some time"
})

module.exports = {limiter};