#!/usr/bin/env node

const oracledb = require('oracledb');
const input = require('../lib/read-infile-promises.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue-promises.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`
let sensors;

//  Using Promises
// Create a default database connection pool 
oracledb
    .createPool(dbconfig)
    .then(function() {
        input.readLines(file)
            .then(function(s) {
                sensors = s
                console.log(sensors)
            })
            .catch(function (error) {
                console.log(error)
            })
    })
    .then(function() {
        return sensor.getCalCertAndDueDate('TZ000005');
    })
    .then(function(result) {
        console.log(result[0]);
    })
    .catch(function(err) {
        console.log(err);
    });