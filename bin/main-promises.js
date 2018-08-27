#!/usr/bin/env node

const oracledb = require('oracledb');
const fs = require('fs');
const input = require('../lib/read-infile-promises.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue-promises.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`
let barcodes = [];

// Write the results to output file
const outputWS = fs.createWriteStream(`${file}_new3.csv`);

//  Using Promises
// Create a default database connection pool 
oracledb.createPool(dbconfig)
    .then(function() {
        return input.readLines(file)
    })
    .then(function(b) {
        console.log('Done reading input file')
        barcodes = b
    })
    .then(function() {
        return Promise.all(barcodes.map((barcode) => sensor.getCalCertAndDueDate(barcode)))
    })
    .then(function(results) {
        console.log('Done querying DB')
        return Promise.all(results.map((result) => outputWS.write(`${result[0].toString()}\n`)))
    })
    .then(function() {
        console.log('Done writing output file')
        outputWS.end()
    })
    .catch(function (error) {
        console.log(error)
    })
