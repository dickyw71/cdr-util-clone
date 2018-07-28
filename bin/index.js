#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

// get arguments after first two elements in process.argv
var arguments = process.argv.splice(2);

var filepath = arguments[0];
var infile  = arguments[1];

console.log(`filepath: ${filepath}`);
console.log(`inputFilename: ${infile}`);

// check that the filepath and input file can be r/w accessed
var fileAccessOk = false;
fs.access(`${filepath}/${infile}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    console.log(err ? 'no access!' : 'can read/write');
    err ? fileAccessOk = false : fileAccessOk = true; 
    if (!fileAccessOk) {
        console.log(`No access to specified filepath, exiting!`);
        process.exit(1);
    }
  });


var verboseOn = (arguments[2] == '-v' ? true : false);
var outfile = arguments[3] || null;


console.log(`Verbose: ${verboseOn ? 'On' : 'Off'}`)
console.log(`outFilename prefix: ${outfile ? outfile + '_' : 'N/A'}`);
console.log(`CDRlog filename CDRlog_${infile}.log`);

// write the CDRlog file to filepath with start of request
const logFileWS = fs.createWriteStream(`${filepath}/CDRlog_${infile}.log`)
logFileWS.write(`CDRutil started ${new Date(Date.now()).toLocaleString()}\n`)

// read the infile line by line
const infileRS = fs.createReadStream(`${filepath}/${infile}`)
infileRS.setEncoding('utf8')

const rl = readline.createInterface(infileRS);

rl.on('line', (line) => {
    // write the log file with name of each sensor requested
    logFileWS.write(`Barcode requested: ${line}\n`)

})

rl.on('close', () => {
    logFileWS.end()
})



// query the DB

// write the CDR_log file with status of each sensor query

// write the query results to the output file or files if an outfile is non-null
