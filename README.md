## hierarchical-copy

Copy files hierarchically with wildcards supports.

If you just want copy files with simple command across platforms, forgot `rsync` and `ditto` on OSX, `cp --parents` on linux, use this right now.

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
rcp ./examples/*.txt ./dist
rcp src/js/**/*.js !src/others/**/*.js ./dist
```

with verbose option will log file paths
```
rcp -v ./examples/*.txt .dist
```
