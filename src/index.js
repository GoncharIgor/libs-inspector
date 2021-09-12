const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const getInfoFromNpmsForDependencies = require('./npms-api').getInfoFromNpmsForDependencies;
const checkFileExists = require('./file-helper');
const getDuplicatesWithinTwoArrays = require('./array-helper');

function getPackageJsonInfoFromUserRepo() {
    const pathOfCurrentModule = process.argv[1];
    const pathToPackageJson = path.join(pathOfCurrentModule, '../../../package.json')
    const packageJsonFile = require(pathToPackageJson);

    console.log('Getting dependencies list from your package.json');
    const {dependencies, devDependencies, name} = packageJsonFile;

    return [dependencies, devDependencies, name];
}

async function generateReportData(dependencies, devDependencies) {
    let fullReportData = {};

    if (dependencies) {
        console.log(`Gathering data from npmjs registry for your ${Object.keys(dependencies).length} dependencies...`);
        fullReportData.dependencies = await getInfoFromNpmsForDependencies(dependencies);
    }

    if (devDependencies) {
        console.log(`Gathering data from npmjs registry for your ${Object.keys(devDependencies).length} devDependencies...`);
        fullReportData.devDependencies = await getInfoFromNpmsForDependencies(devDependencies);
    }

    fullReportData.duplicates = getDuplicatesWithinTwoArrays(Object.keys(dependencies), Object.keys(devDependencies));

    return fullReportData;
}

function writeDependenciesDataIntoLibsLocalJsonFile(data, projectName) {
    const pathOfCurrentModuleBinInUserRepo = process.argv[1];
    const pathToLocalLibsDataJson = path.join(pathOfCurrentModuleBinInUserRepo, '../../libs-inspector/libs-inspector-report/data.js');

    if (checkFileExists(pathToLocalLibsDataJson)) {
        console.log('Removing the previous version of data.js');
        fs.unlinkSync(pathToLocalLibsDataJson);
    }

    console.log('Creating data.js with all dependencies info');
    console.log(JSON.stringify({projectName, ...data}));
    fs.writeFileSync(pathToLocalLibsDataJson, `var data = ${JSON.stringify({projectName, ...data})}`, 'utf8');
}

function copyReportFolderToUserRepo() {
    const pathOfCurrentModuleBinInUserRepo = process.argv[1];
    const pathToUsersRepo = path.join(pathOfCurrentModuleBinInUserRepo, '../../../libs-inspector-report');

    const pathToLocallyGeneratedReportInLib = path.join(__dirname, '../libs-inspector-report');

    if (!checkFileExists(pathToUsersRepo)) {
        fs.mkdirSync(pathToUsersRepo, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    console.log('Copying generated report to user repo');
    // { overwrite: true } - to replace existing folder or file with same name
    fse.copySync(pathToLocallyGeneratedReportInLib, pathToUsersRepo, {overwrite: true});
}

module.exports = {
    getPackageJsonInfoFromUserRepo,
    generateReportData,
    writeDependenciesDataIntoLibsLocalJsonFile,
    copyReportFolderToUserRepo
};
