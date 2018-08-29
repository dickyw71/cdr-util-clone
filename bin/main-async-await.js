#!/usr/bin/env node

const oracledb = require('oracledb');
const fs = require('fs');
const input = require('../lib/read-infile-promises.js');
const dbconfig = require('../lib/db-config.js');
const sensor = require('../lib/cert-caldue-async-await.js');

let file = `/Users/richardwheatley/Developer/cdr-util-clone/test/dmc`

// Using async/await

async function startApp() {
    try {
        const barcodes = await input.readLines(file)
        console.log('Done reading input file')

        await oracledb.createPool(dbconfig)

        let results = await Promise.all(barcodes.map((barcode) => sensor.getCalCertAndDueDate(barcode)))
        console.log('Done querying database')
        console.log(results)

        let outputWS = fs.createWriteStream(`${file}_new4.csv`);
        await Promise.all(results.map((result) => outputWS.write(`${result[0].toString()}\n`)))
        outputWS.end()
        console.log('Done writing output file')

    } catch (error) {
        console.log(error)
    }
}

startApp();