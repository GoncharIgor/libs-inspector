# libs-inspector

[![GitHub Stars](https://img.shields.io/github/stars/GoncharIgor/libs-inspector.svg)](https://github.com/GoncharIgor/libs-inspector/stargazers)
![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg)

## What is it

This is a UI representation of all dependencies in your package.json with their description

## Demo

Here is the example of generated libs-inspector report:
![alt text](example/demo.jpg "Libs Inspector report demo")

## Install

```bash
npm install --save-dev libs-inspector
```

## Usage

1. open your `package.json` file
2. add new script with calling `libs-inspector` library
e.g:
```javascript
"scripts": {
   "generate:lib-report": "libs-inspector"
}
```
3. run npm script:  
   `npm run generate:lib-report`
4. in project source root new folder will be generated: `libs-inspector-report`
5. open it's `index.html`

## Details of realisation
- The report generates 2 tables: dependencies and devDependencies
- If your project doesn't have devDependencies, then it will be written in empty block
- Information for each dependency is being retrieved from: https://npms.io
- If the dependency info couldn't be got from `npms.io`, then the row is highlighted in red


## License

MIT (http://www.opensource.org/licenses/mit-license.php)
