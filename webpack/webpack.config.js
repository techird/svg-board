"use strict";

module.exports = process.env.NODE_ENV === "production"
    ? require("./webpack.prod.js")
    : require("./webpack.dev.js");