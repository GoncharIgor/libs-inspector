const localJsonFile = "./example/data.json";

window.addEventListener("DOMContentLoaded", async () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    const depTable = document.getElementById('dependencies-table');
    const devDepTable = document.getElementById('dev-dependencies-table');

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
