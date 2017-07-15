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
rcp 'src/js/**/*.js' ./dist
```
Notes: you should wrap a glob with quote, otherwise node will auto glob in unix envs and result in unexpect actions.

with verbose option will log file paths
```
rcp -v ./examples/*.txt .dist
```
