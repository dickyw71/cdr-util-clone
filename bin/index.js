#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const da = require('../lib/data-access.js');

// get arguments after first two elements in process.argv
var arguments = process.argv.splice(2);

const filepath = arguments[0];
const infile  = arguments[1];

const verboseOn = (arguments[2] == '-v' ? true : false);
const outfile = arguments[3] || null;

// log file counters
let numOfBarcodesFound = 0;
let numOfBarcodesNotFound = 0;
let numOfBarcodeErrors = 0;


console.log(`filepath: ${filepath}`);
console.log(`inputFilename: ${infile}`);
console.log(`Verbose: ${verboseOn ? 'On' : 'Off'}`)
console.log(`outFilename prefix: ${outfile ? outfile + '_' : 'N/A'}`);
console.log(`CDRlog filename CDRlog_${infile}.log`);

// check that the filepath and input file can be r/w accessed
let fileAccessOk = false;
fs.access(`${filepath}/${infile}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    console.log(err ? 'no access!' : 'can read/write');
    err ? fileAccessOk = false : fileAccessOk = true; 
    if (!fileAccessOk) {
        console.log(`No access to specified filepath, exiting!`);
        process.exit(1);
    }
    else {
        // create the outfile
        const outfileWS = fs.createWriteStream(`${filepath}/${infile}.csv`) 

        // write the CDRlog file to filepath with start of request
        const logFileWS = fs.createWriteStream(`${filepath}/CDRlog_${infile}.log`)
        logFileWS.write(`CDRutil started ${new Date(Date.now()).toLocaleString()}\n`)

        // if(!da.openDbConnection()) {    // Failed openning connection to database 
        //     console.log('failed opening DB connection')
        // }
        // else {
        da.openDbConnection((err, connection) => {
            if(err) {
                console.log(err.message)
            }
            else {
                // read the infile line by line
                const infileRS = fs.createReadStream(`${filepath}/${infile}`)
                infileRS.setEncoding('utf8')
                const rl = readline.createInterface(infileRS);

                //  readline 'line' event handler - fired for each line read from the infile 
                rl.on('line', (barcode) => {

                    console.log(barcode)

                    // pause input stream
                    rl.pause();

                    // write the log file with name of each sensor requested
                    logFileWS.write(`Barcode requested: ${barcode}\n`)

                    // query the DB
                    const resultRow = da.getSensor(barcode, (err, result) => {
                        if(err) {
                            console.log(err.message)
                        }
                        else {
                            console.log(result)
                            // write the CDR_log file with status of each sensor query
                            if(result === null) {    // error getting barcode
                                numOfBarcodeErrors++
                                logFileWS.write(`Error returned for barcode:${barcode}.\n`)
                                return;
                            }
                            if(result.row.length === 0) { //  barcode not found
                                numOfBarcodesNotFound++
                                logFileWS.write(`Barcode:${barcode} was not found.\n`)
                                return;
                            }
                            // write the query results to the output file or files if an outfile is non-null
                            if(result.row.length === 1) { // barcode found
                                numOfBarcodesFound++
                                logFileWS.write(`Barcode:${barcode} was found OK.\n`)
                                outfileWS.write(`${result.row[0].toString()}\n`)
                                return;
                            }
                        }
                    });
                    // resume input stream
                    rl.resume();
                })

                rl.on('pause', () => {
                    console.log('Readline paused.');
                  }
                );

                rl.on('resume', () => {
                    console.log('Readline resumed.');
                  }
                );

                //  readline 'close' event handler - fired when the end of the read stream is reached
                rl.on('close', () => {
                    console.log('Closing everything')
                    da.closeDbConnection((err) => {
                        if(err) {
                            console.log(err.message)
                        }
                        logFileWS.write(`***********************************************\n
                        Number of barcodes found: ${numOfBarcodesFound}\n\n
                        Number of barcodes not found: ${numOfBarcodesNotFound}\n\n
                        Number of barcodes rejected: ${numOfBarcodeErrors}\n\n
                        ***********************************************\n`)
                        logFileWS.write(`CDRutil finished ${new Date(Date.now()).toLocaleString()}\n`)                
                        logFileWS.end()
                        outfileWS.end()   
                    });
                })
            }
        });
 
        // }
    }
  });

 





