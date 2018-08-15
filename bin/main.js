#!/usr/bin/env node

const oracledb = require('oracledb');
const input = require('./../lib/read-infile.js');
const dbconfig = require('./../lib//db-config.js');
const sensor = require('./../lib/cert-caldue.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`

//  Using callbacks
input.getSensors(file, function(err, sensors) {
    if (err) {
        console.log(err);
        return;
    }

    oracledb.createPool(dbconfig, function(err) {
        if (err) {
            console.log('Error getting connection', err);
            return;
        }

        sensors.forEach(barcode => {
            sensor.getCalCertAndDueDate(barcode, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result);
            });           
        });
    });
});

//  Using Promises
// input.getSensors(file)
//     .then(function(sensors) {

//     })

//  Using async/await
//  TO-DO