"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var fs = require("fs");
var path = require("path");
var vinylfs = require("vinyl-fs");
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
var destHandler = function (file) {
    var input = file.path;
    var output = path.resolve(dest);
    if (file.path.startsWith(base)) {
        output = path.resolve(dest, file.path.replace(new RegExp("^" + base + "/?(.*)"), function (m, p1) {
            return p1;
        }));
    }
    if (verbose) {
        console.log(colors.yellow(input) + "\n...--->" + colors.green(output) + "\n");
    }
    return output;
};
try {
    vinylfs.src(sources).pipe(vinylfs.dest(destHandler));
}
catch (e) {
    throw e;
}
