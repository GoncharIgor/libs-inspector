const fs = require('fs');

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

module.exports = checkFileExists;
