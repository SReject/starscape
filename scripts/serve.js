// node serv.js [port ["dir"]]

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const port = parseInt(process.argv[2] || 9000, 10);

const directory = path.resolve(process.argv.slice(3).join(" ") || path.join(__dirname, '../build/'));

const mimeType = {
    '.html': 'text/html',
    '.htm' : 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
};

http.createServer(async function (req, res) {
    console.log(`${req.method} ${req.url}`);

    // Only support GET requests
    if (req.method !== 'GET') {
        res.statusCode = 405;
        res.statusMessage = 'METHOD NOT SUPPORTED';
        res.end('Method not supported');
        return;
    }

    // process uri
    let uri = req.url
        .replace(/\?.*/, '')       // remove query parameters
        .replace(/#.*/, '')        // remove hash (shouldn't be sent but shrug)
    uri = decodeURI(uri);          // decode escaped characters
    uri = uri.replace(/\\/g, '/'); // normalize slashes

    // prevent various attacks
    if (/:|(?:(^|(?<=\/))\.+(?:\/|$))/.test(uri)) {
        res.statusCode = 400;
        res.statusMessage = 'BAD REQUEST';
        res.end('Bad request');
        return;
    }

    // quantify URI
    let resource = path.join(directory, uri);
    try {

        // if dir, use resource/index.html
        const stat = await fs.lstat(resource);
        if (stat.isDirectory()) {
            resource = path.join(resource, 'index.html');
        }

        // send file
        const data = await fs.readFile(resource);
        const ext = path.parse(resource).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET')
        res.end(data);

    } catch (err) {

        // File Not Found
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.statusMessage = 'FILE NOT FOUND';
            res.end(`File ${uri} not found!`);

        // some other error
        } else {
            res.statusCode = 500;
            res.statusMessage = 'INTERNAL ERROR'
            res.end('Internal server error');
            console.log(err);
        }
    }

}).listen(port);

console.log(`Server listening on port ${port} serving files from ${directory}`);