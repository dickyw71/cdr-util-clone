const oracledb = require('oracledb')

function getCertCalDue(sensorBarcode, getCertCalDueCallback) {
    
    oracledb.getConnection(function(err, conn) {
        if (err) {
            console.log('Error getting connection', err);
            getCertCalDueCallback(err);
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
        WHERE bar_code = :sensorBarcode`
        , [sensorBarcode]
        , { maxRows : 1
            , fetchInfo : {
                "CAL_DUE_DATE": { type: oracledb.STRING }
            }
        },
        function(err, result) {
            if (err) {
                console.log('Error executing query', err);

                getCertCalDueCallback(err);

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

            getCertCalDueCallback(null, result.rows[0]);

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

module.exports.getCertCalDue = getCertCalDue;