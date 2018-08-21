#!/usr/bin/env node

const oracledb = require('oracledb');
const fs = require('fs');
const input = require('../lib/read-infile.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`

// Write the results to output file
const outputWS = fs.createWriteStream(`${file}_new.csv`);

//  Using callbacks
// Create a default database connection pool 
oracledb.createPool(dbconfig, function(err) {
    if (err) {
        console.log('Error getting database connection', err);
        return;
    }

    // Read lines from input file into barcodes array 
    input.readLines(file, function(err, barcodes) {
        if (err) {
            console.log(err);
            return;
        }

        // For each barcode in the array, Query the database for most recent cal certificate and due date 
        barcodes.forEach(barcode => {
            sensor.getCalCertAndDueDate(barcode, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result[0]);

                if(result[0][1] !== undefined) {
                    outputWS.write(`${result[0].toString()}\n`);
                }
            });           
        });
    });
});

