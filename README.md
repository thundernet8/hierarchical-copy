## hierarchical-copy

Copy files hierarchically with wildcards supports.

## Install

npm
```
npm install hierarchical-copy -g
```

yarn
```
yarn global add hierarchical-copy
```

## Usage
```
rcp src/js/**/*.js ./dist
```

with relative path option will affect the output files paths
```
rcp -b src src/js/**/*.js ./dist // e.g src/js/clients/test.js -> dist/js/clients/test.js

rcp -b src/js src/js/**/*.js ./dist // e.g src/js/clients/test.js -> dist/clients/test.js
```

with verbose option will log file paths
```
rcp -v ./examples/*.txt .dist
```
