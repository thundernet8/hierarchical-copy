"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var fs = require("fs");
var path = require("path");
var vinylfs = require("vinyl-fs");
var map = require("map-stream");
var pkg = require("../package.json");
var colors = require("colors");
var argvs = process.argv;
if (argvs && argvs.indexOf("--version") > -1) {
    console.log(pkg.version);
    process.exit(0);
}
var verbose = false;
var base = ".";
var filterArgs = function () {
    var isOptionValue = false;
    argvs.splice(0, 2);
    argvs = argvs.filter(function (value) {
        if (value.startsWith("-")) {
            if (value === "-v") {
                verbose = true;
            }
            if (value === "-b") {
                isOptionValue = true;
            }
            return false;
        }
        if (isOptionValue) {
            isOptionValue = false;
            base = value;
            return false;
        }
        return true;
    });
    return argvs;
};
if (!argvs || filterArgs().length < 2) {
    console.info(colors.yellow("\nShort of arguments, you should provide one source glob at least and one destination glob!\n\nUsage: rcp [-b .] [[source globs]...] [destination glob]\n Example: rcp -b ./example ./example/*.txt ./dist"));
    process.exit(0);
}
if (!fs.lstatSync(base).isDirectory()) {
    throw new Error("Relative base path should be a directory!");
}
else {
    base = path.resolve(base);
}
var sources = argvs.slice(0, argvs.length - 1);
var dest = argvs[argvs.length - 1];
var log = function (file, cb) {
    if (verbose) {
        console.log(colors.green(file.path) + "\n");
    }
    cb(null, file);
};
try {
    vinylfs.src(sources).pipe(map(log)).pipe(vinylfs.dest(dest));
}
catch (e) {
    throw e;
}
