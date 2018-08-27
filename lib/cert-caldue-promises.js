const oracledb = require('oracledb')

function getCalCertAndDueDate(sensorBarcode) {
    return new Promise( function(resolve, reject) {
        let conn;

        oracledb
            .getConnection()
            .then(function(c) {
                console.log('Connected to database');

                conn = c;

                return conn.execute(
                    `SELECT bar_code as barcode
                        , cert_no 
                        , cal_due_date
                    FROM sensor s 
                    JOIN sensor_calibration sc 
                        ON(s.sensor_id = sc.sensor_id)
                    WHERE bar_code = :sensorBarcode`
                    , [sensorBarcode]
                    , { maxRows : 1
                        , fetchInfo : {
                            "CAL_DUE_DATE": { type: oracledb.STRING }
                        }
                    }
                );
            })
            .then(function(result) {
                console.log('Select query executed');

                resolve(result.rows[0] ? [result.rows[0]] : [[sensorBarcode, undefined, undefined]]);
            },
            function(err) {
                console.log('Error occurred', err);
        
                reject(err);
                }
            )
            .then(function() {
                if (conn) {
                // If conn assignment worked, need to close.
                return conn.close();
                }
            })
            .then(function() {
                console.log('Connection closed');
            })
            .catch(function(err) {
                // If error during close, just log.
                console.log('Error closing connection', err);
            });          
    });
}

module.exports.getCalCertAndDueDate = getCalCertAndDueDate;