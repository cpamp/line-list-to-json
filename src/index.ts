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

var outFile: string = '',
    inFile: string = '';
argManager.onDefault((defaults) => {
    if (defaults.length < 2) { 
        console.log('Error: InFile and OutFile required.');
        console.log('Ex:' + '\x1b[41m\x1b[33mlljson path/to/in/file.txt outFileName [-p, --pretty=2]\x1b[0m');
        process.exit();
    }

    inFile = defaults[0];
    outFile = defaults[1];

    var lineReader = createInterface({
        input: fs.createReadStream(inFile)
    });

    var newArray: string[] = [];
    lineReader.on('line', (line: string) => {
        newArray.push(line);
    });

    lineReader.on('close', () => {
        if (outFile.indexOf('.json') === -1) {
            outFile = outFile + '.json';
        }

        var json: string = pretty ? JSON.stringify(newArray, null, prettySpace) : JSON.stringify(newArray);

        fs.writeFile(outFile, json, (err) => {
            if      (err) console.log(err);
            else    console.log('JSON outputed to ./' + outFile);
        });
    });
});