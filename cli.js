#!/usr/bin/env node

const {
    getPackageJsonInfoFromUserRepo,
    generateReportData,
    writeDependenciesDataIntoLocalJsonFile,
    copyReportFolderToUserRepo
} = require('./index');

(async () => {
    const [dep, devDep, projectName] = await getPackageJsonInfoFromUserRepo();
    const fullReportData = await generateReportData(dep, devDep);
    writeDependenciesDataIntoLocalJsonFile(fullReportData, projectName);
    copyReportFolderToUserRepo();
})();

