#!/usr/bin/env node

import { ArgumentManager, Argument } from 'node-cli-args';
import * as fs from 'fs';
import { createInterface } from 'readline';

var argManager = new ArgumentManager();

var pretty: boolean,
    prettySpace: number;
argManager.on(new Argument('pretty', 'p', 2), (value, defaultValue) => {
    pretty = true;
    var parsed = parseInt(value);
    prettySpace = parsed !== NaN ? parsed : defaultValue;
});

var overwrite: boolean = false;
argManager.on(new Argument('overwrite', 'o'), () => {
    overwrite = true;
});

var outFile: string = '',
    inFile: string = '';
argManager.onDefault((defaults) => {
    if (defaults.length < 2) { 
        console.log('Error: InFile and OutFile required.');
        console.log('Ex:' + '\x1b[41m\x1b[33mlljson path/to/in/file.txt outFileName [-p, --pretty=2] [-o, --overwrite]\x1b[0m');
        process.exit();
    }

    inFile = defaults[0];
    outFile = defaults[1];
    if (outFile.indexOf('.json') === -1) {
        outFile = outFile + '.json';
    }
});

if (!fs.existsSync(inFile)) {
    console.log('InFile does not exist: ' + inFile);
    process.exit();
}

if (!overwrite && fs.existsSync(outFile)) {
    console.log('OutFile already exists: ' + outFile);
    console.log('Use [-o, --overwrite] to overwrite the file.');
    process.exit();
}

var lineReader = createInterface({
    input: fs.createReadStream(inFile)
});

var newArray: string[] = [];
lineReader.on('line', (line: string) => {
    newArray.push(line);
});

lineReader.on('close', () => {
    var json: string = pretty ? JSON.stringify(newArray, null, prettySpace) : JSON.stringify(newArray);

    fs.writeFile(outFile, json, (err) => {
        if      (err) console.log(err);
        else    console.log('JSON outputed to ./' + outFile);
    });
});