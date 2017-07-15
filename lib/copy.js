"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var vinylfs = require("vinyl-fs");
var map = require("map-stream");
var pkg = require("../package.json");
var argvs = process.argv;
if (argvs && argvs.indexOf("--version") > -1) {
    console.log(pkg.version);
    process.exit(0);
}
if (!argvs || argvs.length < 2) {
    console.info("\nShort of arguments, you should provide one source glob at least and one destination glob!\n\nUsage: rcp [[source globs]...] [destination glob]\n Example: rcp ./example/*.txt ./dist");
    process.exit(0);
}
var verbose = false;
argvs = argvs.filter(function (value) {
    if (value.startsWith("-")) {
        if (value === "-v") {
            verbose = true;
        }
        return false;
    }
    return true;
});
var sources = argvs.slice(0, argvs.length - 1);
var dest = argvs[argvs.length - 1];
var log = function (file, cb) {
    if (verbose) {
        console.log(file.path);
    }
    cb(null, file);
};
try {
    vinylfs.src(sources).pipe(map(log)).pipe(vinylfs.dest(dest));
}
catch (e) {
    throw e;
}
