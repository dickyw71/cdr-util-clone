#!/usr/bin/env node

const oracledb = require('oracledb');
const input = require('../lib/read-infile.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`


// input.getSensors(file)
//     .then(function(sensors) {

//     })