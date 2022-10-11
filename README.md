# libs-inspector

[![Current Version](https://img.shields.io/github/package-json/v/GoncharIgor/libs-inspector?color=%2397c40f)](https://github.com/GoncharIgor/libs-inspector)
[![GitHub Stars](https://img.shields.io/github/stars/GoncharIgor/libs-inspector.svg?logo=github)](https://github.com/GoncharIgor/libs-inspector/stargazers)
![MIT license](https://img.shields.io/github/license/GoncharIgor/libs-inspector)

## What is it

This is a UI report of all dependencies in your package.json with their description and suggestions for upgrade

## Demo

Here is the running [demo](https://goncharigor.github.io/libs-inspector/) of generated libs-inspector report:
[![alt text](example/demo.jpg "Libs Inspector report demo")](https://goncharigor.github.io/libs-inspector/)

## Install

```bash
npm install --save-dev libs-inspector
```

## Usage

1. open your project's root folder
2. run in the terminal: `npx libs-inspector`
3. a new folder will be generated in project's root: `libs-inspector-report`
4. open it's `index.html`

**Tips for automated usage:**
1. Add `libs-inspector` package to `devDependencies` in your `package.json` file
2. Add new npm script to your `package.json` file, that will call `libs-inspector` library. E.g:
```javascript
"scripts": {
   "generate:lib-report": "libs-inspector"
}
```
3. You can run this script whenever you want in your CI with `npm run generate:lib-report` command, but better - to add it to `postinstall` script. E.g:
```javascript
"scripts": {
   "postinstall": "npm run generate:lib-report"
}
```
Each time you setup a project and install dependencies, the report will be automatically generated

Don't forget to add generated `libs-inspector-report` folder to your `.gitignore` file

## Details of realisation
- The report generates 2 tables: dependencies and devDependencies
- If your project doesn't have devDependencies, then it will be written in empty block
- Information for each dependency is being retrieved from: https://npms.io
- If the dependency info couldn't be got from `npms.io`, then the row is highlighted in red
- When package version can be updated to new major version, its cell is highlighted
- If dependency is being duplicated in devDependencies, then the row is highlighted in red


## Next features to come
- vulnerabilities check
- configuration file for excluding specific libs


## License

>You can check out the full license [here](https://github.com/GoncharIgor/libs-inspector/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
