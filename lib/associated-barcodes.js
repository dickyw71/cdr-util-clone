const oracledb = require('oracledb')

function getAssociatedBarcodes(sensorBarcode, getAssociatedBarcodesCallback) {
    oracledb.getConnection(function(err, conn) {
        if (err) {
            console.log('Error getting connection', err);
            getAssociatedBarcodesCallback(err);
            return;
        }
        console.log('Connected to database');

        conn.execute(
        `SELECT bar_code as barcode
            , cert_no 
            , cal_due_date
        FROM sensor s 
        JOIN sensor_calibration sc 
            ON(s.sensor_id = sc.sensor_id)
        WHERE bar_code = :barcode`
        , [sensorBarcode]
        , { maxRows : 0
            , fetchInfo : {
                "CAL_DUE_DATE": { type: oracledb.OBJECT }
            }
        },
        function(err, result) {
            if (err) {
                console.log('Error executing query', err);

                getAssociatedBarcodesCallback(err);

                conn.close(function(err) {
                    if (err) {
                        console.log('Error closing connection', err);
                    } else {
                        console.log('Connection closed');
                    }
                });
                return;
            }

            console.log('Cert Cal Due query executed');

            getAssociatedBarcodesCallback(null, result.rows);

            conn.close(function(err) {
                if (err) {
                    console.log('Error closing connection', err);
                } else {
                    console.log('Connection closed');
                }
            });
        }
        );
    });
}

module.exports.getAssociatedBarcodes = getAssociatedBarcodes;