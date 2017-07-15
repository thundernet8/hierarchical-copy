import * as process from "process";
import * as fs from "fs";
import * as path from "path";
import * as vinylfs from "vinyl-fs";
import * as pkg from "../package.json";
import * as colors from "colors";

let argvs = process.argv;

if (argvs && argvs.indexOf("--version") > -1) {
  console.log(pkg.version);
  process.exit(0);
}

let verbose = false;
let base = ".";

const filterArgs = () => {
  let isOptionValue = false; // -b optionValue
  argvs.splice(0, 2); // 0 -> /usr/local/bin/node 1 -> /usr/local/bin/rcp
  argvs = argvs.filter(value => {
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
  console.info(
    colors.yellow(
      "\nShort of arguments, you should provide one source glob at least and one destination glob!\n\nUsage: rcp [-b .] [[source globs]...] [destination glob]\n Example: rcp -b ./example ./example/*.txt ./dist"
    )
  );
  process.exit(0);
}

// handle base and make sure it is a directory
if (!fs.lstatSync(base).isDirectory()) {
  throw new Error("Relative base path should be a directory!");
} else {
  base = path.resolve(base);
}

const sources = argvs.slice(0, argvs.length - 1);
const dest = argvs[argvs.length - 1];

const destHandler = file => {
  let input = file.path;
  let output = path.resolve(dest);
  if (file.path.startsWith(base)) {
    output = path.resolve(
      dest,
      file.path.replace(new RegExp(`^${base}/?(.*)`), (m, p1) => {
        return p1;
      })
    );
  }

  if (verbose) {
    console.log(`${colors.yellow(input)}\n--->${colors.green(output)}\n`);
  }
  return output;
};

try {
  vinylfs.src(sources).pipe(vinylfs.dest(destHandler));
} catch (e) {
  throw e;
}
