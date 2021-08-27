#!/usr/bin/env node

const {
    getPackageJsonInfoFromUserRepo,
    generateReportData,
    writeDependenciesDataIntoLocalJsonFile,
    copyReportFolderToUserRepo
} = require('./index');

(async () => {
    const [deps, devDeps, projectName] = await getPackageJsonInfoFromUserRepo();
    const fullReportData = await generateReportData(deps, devDeps);
    writeDependenciesDataIntoLocalJsonFile(fullReportData, projectName);
    copyReportFolderToUserRepo();
})();

