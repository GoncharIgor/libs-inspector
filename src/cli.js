#!/usr/bin/env node

const {
    getPackageJsonInfoFromUserRepo,
    generateReportData,
    writeDependenciesDataIntoLibsLocalJsonFile,
    copyReportFolderToUserRepo
} = require('./index');

(async () => {
    const [deps, devDeps, projectName] = getPackageJsonInfoFromUserRepo();
    const fullReportData = await generateReportData(deps, devDeps);
    writeDependenciesDataIntoLibsLocalJsonFile(fullReportData, projectName);
    copyReportFolderToUserRepo();
})();

