"use strict";

var rollup = require("rollup");

rollup.rollup({
    entry   : "./main.js",
    plugins : [
        require("rollup-plugin-node-resolve")({ ignoreGlobal : true }),
        require("rollup-plugin-commonjs")(),
        require("rollup-plugin-buble")()
    ]
})
.then(function(bundle) {
    return bundle.write({
        format : "iife",
        dest   : "./gen/main.js"
    });
});
