#!/usr/bin/env node

const oracledb = require('oracledb');
const fs = require('fs');
const async = require('async');
const input = require('../lib/read-infile.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`

// Write the results to output file
const outputWS = fs.createWriteStream(`${file}_new2.csv`);

// Using Async library
async.waterfall(
    [
        function(callback) {
            oracledb.createPool(dbconfig, function(err) {
                callback(err);
            });
        },
        function(callback) {
            input.readLines(file, function(err, barcodes) {
                if(err) {
                    callback(err);
                }
                else {
                    callback(null, barcodes);
                }
            });
        },
        function(barcodes, callback) {
            async.concatSeries(barcodes, sensor.getCalCertAndDueDate, function(err, result) {
                if(err) {
                    callback(err);
                    return;
                }
                callback(null, result);
            });       
        },
        function(results, callback) {
            async.everySeries(results, function(result, callback) {
                if(result[0][1] !== undefined) {
                    outputWS.write(`${result[0].toString()}\n`);
                }
            }, function(err) {
                if(err) {
                    callback(err);
                    return;
                }
                outputWS.end();
                callback(null, results);
            });
        }
    ],
    function(err, results) {
        console.log(results);
    }
)