const localJsonFile = "./data.json";
const semverRegExp = /^([\^~])?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

window.addEventListener("DOMContentLoaded", async () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // dependencies table elements
    const depTable = document.getElementById('dependencies-table');
    const dependenciesCaption = document.getElementById('dependencies-caption');
    const tabHead = document.getElementById('table-head');
    const devDependenciesChevron = document.getElementById('dev-dependencies-chevron');

    // devDependencies table elements
    const devDepTable = document.getElementById('dev-dependencies-table');
    const devDependenciesCaption = document.getElementById('dev-dependencies-caption');
    const devTabHead = document.getElementById('dev-table-head');
    const dependenciesChevron = document.getElementById('dependencies-chevron');

    let isTableShown = true;
    let isDevTableShown = true;

    dependenciesCaption.addEventListener('click', (e) => {
        e.stopPropagation();
        tabHead.style.display = isTableShown ? 'none' : 'block';
        depTable.style.marginBottom = isTableShown ? '0' : '15px';

        rotateChevron(dependenciesChevron, isTableShown);
        isTableShown = !isTableShown;
    })

    devDependenciesCaption.addEventListener('click', (e) => {
        e.stopPropagation();
        devTabHead.style.display = isDevTableShown ? 'none' : 'block';
        devDepTable.style.marginBottom = isDevTableShown ? '0' : '15px';

        rotateChevron(devDependenciesChevron, isDevTableShown);
        isDevTableShown = !isDevTableShown;
    })

    const response = await fetch(localJsonFile);
    const dataFile = await response.json();

    // set Project title
    let projectTitle = document.getElementById('project-title');
    projectTitle.innerText = dataFile.projectName;

    let dependenciesList = [];
    let devDependenciesList = [];

    dataFile.dependencies ?
        dependenciesList = Object.entries(dataFile.dependencies)
        : createEmptyStateForTable(depTable, 'No dependencies found in the package.json');

    dataFile.devDependencies ?
        devDependenciesList = Object.entries(dataFile.devDependencies)
        : createEmptyStateForTable(devDepTable, 'No devDependencies found in the package.json');

    // fill dependencies table
    dependenciesList.forEach((dependency, index) => {
        [dependencyName, dependencyData] = dependency;
        insertTableRow(depTable, dependencyName, dependencyData, index);
    })

    // fill devDependencies table
    devDependenciesList.forEach((devDependency, index) => {
        [devDependencyName, devDependencyData] = devDependency;
        insertTableRow(devDepTable, devDependencyName, devDependencyData, index);
    })
});

function rotateChevron(tableChevron, isRotationApplied) {
    if (isRotationApplied) {
        tableChevron.classList.add('rotate-up');
    } else {
        tableChevron.classList.remove('rotate-up');
    }
}

function insertTableRow(table, dependencyName, dependencyData, index) {
    let row;

    if (index === 0) {
        row = table.insertRow(0);
    }

    row = table.insertRow(-1);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.innerHTML = (index + 1).toString();
    cell2.innerHTML = dependencyName;

    if (!dependencyData.description) {
        row.classList.add('table-danger');

        cell3.setAttribute('colspan', '7')
        cell3.innerHTML = '<i>Could not get information for this dependency from npm registry</i>';
    } else {
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);
        const cell9 = row.insertCell(8);

        cell4.classList.add('d-none', 'd-lg-table-cell');
        cell5.classList.add('d-none', 'd-lg-table-cell');
        cell6.classList.add('d-none', 'd-lg-table-cell');
        cell7.classList.add('d-none', 'd-lg-table-cell');

        cell3.innerHTML = dependencyData.description;
        cell4.innerHTML = dependencyData.usedVersion;
        cell5.innerHTML = dependencyData.latestVersion;

        const isMajorVersionOutdated = compareSemverVersions(dependencyData.usedVersion, dependencyData.latestVersion);
        if (isMajorVersionOutdated) {
            cell4.classList.add('table-warning');
            cell5.classList.add('table-success');
        }

        cell6.innerHTML = getDependenciesAmount(dependencyData.dependencies);
        cell7.innerHTML = getDependenciesAmount(dependencyData.devDependencies);
        cell8.innerHTML = `<a href="${dependencyData.links.npm}" target="_blank"><i class="bi bi-box" style="color: cornflowerblue; cursor: pointer"></i></a>`;
        cell9.innerHTML = `<a href="${dependencyData.links.repository}" target="_blank"><i class="bi bi-github" style="color: cornflowerblue; cursor: pointer"></i></a>`;
    }
}

function createEmptyStateForTable(table, emptyStateText) {
    const emptyStateElement = document.createElement('div');
    emptyStateElement.classList.add('empty-state');
    emptyStateElement.innerHTML = emptyStateText;
    table.parentNode.appendChild(emptyStateElement);
    table.parentNode.removeChild(table);
}

function getDependenciesAmount(dependencies) {
    if (!dependencies) {
        return '0'
    }

    return Object.keys(dependencies).length.toString();
}

function compareSemverVersions(userPackage, globalPackage) {
    const isUserPackageValidSemver = checkValidityOfSemver(userPackage);
    const isGlobalPackageValidSemver = checkValidityOfSemver(globalPackage);

    if (!isUserPackageValidSemver || !isGlobalPackageValidSemver) {
        return null;
    }

    const userPackageMajorVersion = userPackage.split('.')[0].replace(/[^\d.-]/g, '');
    const globalPackageMajorVersion = globalPackage.split('.')[0].replace(/[^\d.-]/g, '');

    return +userPackageMajorVersion < +globalPackageMajorVersion;
}

function checkValidityOfSemver(version) {
    return semverRegExp.test(version);
}
