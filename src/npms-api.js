const axios = require("axios");
const ProgressBar = require("./progress-bar");

async function getPackageInfoInGlobalRegistry(packageName) {
    let response;

    const formattedPackageName = packageName.replace(/\//g, '%2F');

    try {
        response = await axios.get(`https://api.npms.io/v2/package/${formattedPackageName}`);
    } catch (err) {
        console.log(`
Could not find this repo "${packageName}" in global npm registry`);
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

    return {
        name,
        description,
        latestVersion: version,
        author,
        repository,
        starsCount,
        links,
        dependencies,
        devDependencies,
        score
    };
}

async function getInfoFromNpmsForDependencies(dependencies) {
    const bar = new ProgressBar('Downloading dependencies info: :bar', {
        total: Object.keys(dependencies).length,
        complete: '*',
        incomplete: '.'
    });

    let collectedDependencies = {};

    for (const [dependency, version] of Object.entries(dependencies)) {
        const res = await getPackageInfoInGlobalRegistry(dependency);
        collectedDependencies[dependency] = {usedVersion: version, ...res};
        bar.tick();
    }

    if (!bar.complete) {
        bar.terminate();
    }

    return collectedDependencies;
}

module.exports = {getInfoFromNpmsForDependencies};
