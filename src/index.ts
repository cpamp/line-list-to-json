#!/usr/bin/env node

import { ArgumentManager, Argument } from 'node-cli-args';
import * as fs from 'fs';
import { createInterface } from 'readline';
import { sort } from './sort';
import * as colors from 'colorful-text';

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

var unique: boolean = false;
argManager.on(new Argument('unique', 'u'), () => {
    unique = true;
});

var noBlank: boolean = false;
argManager.on(new Argument('no-blank', 'b'), () => {
    noBlank = true;
});

var ascending: boolean = false;
argManager.on(new Argument('sort-ascending', 'a'), () => {
    ascending = true;
});

var descending: boolean = false;
argManager.on(new Argument('sort-descending', 'd'), () => {
    descending = true;
});

if(ascending && descending) {
    console.log(colors.fg.red('Error: Only sort by ascending or descending.'));
    process.exit();
}

var outFile: string = '',
    inFile: string = '';
argManager.onDefault((defaults) => {
    if (defaults.length < 2) { 
        console.log(colors.fg.red('Error: InFile and OutFile required.'));
        console.log('Ex:' + colors.fg.green('lljson path/to/in/file.txt outFileName [-p, --pretty=2] [-o, --overwrite]'));
        process.exit();
    }

    inFile = defaults[0];
    outFile = defaults[1];
    if (outFile.indexOf('.json') === -1) {
        outFile = outFile + '.json';
    }
});

if (!fs.existsSync(inFile)) {
    console.log(colors.fg.red('InFile does not exist: ' + inFile));
    process.exit();
}

if (!overwrite && fs.existsSync(outFile)) {
    console.log(colors.fg.red('OutFile already exists: ' + outFile));
    console.log(colors.fg.red('Use [-o, --overwrite] to overwrite the file.'));
    process.exit();
}

var lineReader = createInterface({
    input: fs.createReadStream(inFile)
});

var newArray: string[] = [];
lineReader.on('line', (line: string) => {
    if ((!unique || newArray.indexOf(line) === -1) &&
        (!noBlank || line.replace(' ', '') !== '')) {
        newArray.push(line);
    }
});

lineReader.on('close', () => {
    newArray = 
        ascending ? sort(newArray, true) :
        descending ? sort(newArray, false) :
        newArray;
    var json: string = pretty ? JSON.stringify(newArray, null, prettySpace) : JSON.stringify(newArray);

    fs.writeFile(outFile, json, (err) => {
        if      (err) console.log(err);
        else    console.log('JSON outputed to ./' + outFile);
    });
});