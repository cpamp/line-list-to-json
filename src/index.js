var args = process.argv.slice(2);

var inFile = args[0];
var outFile = args[1];
var pretty = args[2] === '-p';

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(inFile)
});

var newArray = [];
lineReader.on('line', function(line) {
    newArray.push(line);
});

lineReader.on('close', function() {
    var fs = require('fs');

    if (outFile.indexOf('.json') === -1) {
        outFile = outFile + '.json';
    }

    var json = pretty ? JSON.stringify(newArray, null, 2) : JSON.stringify(newArray);

    fs.writeFile(outFile, json, function(err) {
        if      (err) console.log(err);
        else    console.log('JSON outputed to ./' + outFile);
    });
});

