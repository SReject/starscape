const fs = require('fs');
const path = require('path');

try {
    fs.rmSync(
        path.join(__dirname, './build/js/'),
        { recursive: true, force: true }
    );
} catch (error) {
    if (error.code !== 'ENOENT') {
        throw error;
    }
}