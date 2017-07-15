import * as process from "process";
import * as vinylfs from "vinyl-fs";
import * as map from "map-stream";
import * as pkg from "../package.json";

let argvs = process.argv;

if (argvs && argvs.indexOf("--version") > -1) {
  console.log(pkg.version);
  process.exit(0);
}

if (!argvs || argvs.length < 2) {
  console.info(
    "\nShort of arguments, you should provide one source glob at least and one destination glob!\n\nUsage: rcp [[source globs]...] [destination glob]\n Example: rcp ./example/*.txt ./dist"
  );
  process.exit(0);
}

let verbose = false;
argvs = argvs.filter(value => {
  if (value.startsWith("-")) {
    if (value === "-v") {
      verbose = true;
    }
    return false;
  }
  return true;
});

const sources = argvs.slice(0, argvs.length - 1);
const dest = argvs[argvs.length - 1];

const log = (file, cb) => {
  if (verbose) {
    console.log(file.path);
  }
  cb(null, file);
};

try {
  vinylfs.src(sources).pipe(map(log)).pipe(vinylfs.dest(dest));
} catch (e) {
  throw e;
}
