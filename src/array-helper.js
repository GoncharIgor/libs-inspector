function getDuplicatesWithinTwoArrays(array1, array2) {
    const duplicatedDependencies = [];

    if (!array1.length || !array2.length) {
        return duplicatedDependencies;
    }

    array1.forEach(item => {
        if (array2.includes(item)) {
            duplicatedDependencies.push(item);
        }
    })

    return duplicatedDependencies;
}

module.exports = getDuplicatesWithinTwoArrays;
