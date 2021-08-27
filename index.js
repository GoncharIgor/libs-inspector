const axios = require('axios');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

async function getPackageInfoInGlobalRegistry(packageName) {
    let response;

    const formattedPackageName = packageName.replace(/\//g, '%2F');

    try {
        response = await axios.get(`https://api.npms.io/v2/package/${formattedPackageName}`);
    } catch (err) {
        console.log(`Could not find this repo "${packageName}" in global npm registry`);
        console.log('\x1b[31m%s\x1b[0m', `${err?.response.status} - ${err?.response.statusText}`);

        return null;
    }

    const starsCount = response.data.collected?.github?.starsCount;
    const {score} = response.data;
    const {
        name,
        description,
        version,
        repository,
        author,
        dependencies,
        devDependencies,
        links
    } = response.data.collected.metadata;

    return {name, description, latestVersion: version, author, repository, starsCount, links, dependencies, devDependencies, score};
}

function getPackageJsonInfoFromUserRepo() {
    const pathOfCurrentModule = process.argv[1];
    const pathToPackageJson = path.join(pathOfCurrentModule, '../../../package.json')
    const packageJsonFile = require(pathToPackageJson);

    const {dependencies, devDependencies, name} = packageJsonFile;

    return [dependencies, devDependencies, name];
}

async function generateReportData(dependencies, devDependencies) {
    let fullReportData = {};

    if (dependencies) {
        fullReportData.dependencies = await getInfoFromNpmsPerDependency(dependencies);
    }

    if (devDependencies) {
        fullReportData.devDependencies = await getInfoFromNpmsPerDependency(devDependencies);
    }

    return fullReportData;
}

async function getInfoFromNpmsPerDependency(dependencies) {
    let collectedDependencies = {};

    for (const [dependency, version] of Object.entries(dependencies)) {
        const res = await getPackageInfoInGlobalRegistry(dependency);
        collectedDependencies[dependency] = {usedVersion: version, ...res};
    }
    return collectedDependencies;
}

function writeDependenciesDataIntoLocalJsonFile(data, projectName) {
    const pathOfCurrentModuleBinInUserRepo = process.argv[1];
    const pathToLocalDataJson = path.join(pathOfCurrentModuleBinInUserRepo, '../../libs-inspector/libs-inspector-report/data.json')

    if (checkFileExists(pathToLocalDataJson)) {
        console.log('Removing the previous version of data.json');
        fs.unlinkSync(pathToLocalDataJson);
    }

    console.log('Creating data.json with all dependencies info');
    fs.writeFileSync(pathToLocalDataJson, JSON.stringify({projectName, ...data}), 'utf8');
}

function copyReportFolderToUserRepo() {
    const pathOfCurrentModuleBinInUserRepo = process.argv[1];
    const pathToUsersRepo = path.join(pathOfCurrentModuleBinInUserRepo, '../../../libs-inspector-report')
    const pathToLocallyGeneratedReport = path.join(__dirname, './libs-inspector-report');

    if (!checkFileExists(pathToUsersRepo)) {
        fs.mkdirSync(pathToUsersRepo, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    console.log('Copying generated report to user repo');
    // { overwrite: true } - to replace existing folder or file with same name
    fse.copySync(pathToLocallyGeneratedReport, pathToUsersRepo, {overwrite: true});
}

function checkFileExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return true;
        }
    } catch (err) {
        console.log('Error occurred');
        console.log(err);
    }

    return false;
}

module.exports = {
    getPackageJsonInfoFromUserRepo,
    generateReportData,
    writeDependenciesDataIntoLocalJsonFile,
    copyReportFolderToUserRepo
};
