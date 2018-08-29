const oracledb = require('oracledb')

function getCalCertAndDueDate(sensorBarcode) {
    return new Promise(async function(resolve, reject) {
        let conn;

        try {
            conn = await oracledb.getConnection()

            console.log('Connected to database');

            let result = await conn.execute(
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

            console.log('Select query executed');

            resolve(result.rows[0] ? [result.rows[0]] : [[sensorBarcode, undefined, undefined]]);

        } catch (err) {
            console.log('Error occurred', err);
        
            reject(err);           
        } finally {
            if (conn) {
                try {
                  await conn.close();
         
                  console.log('Connection closed');
                } catch (err) {
                  console.log('Error closing connection', err);
                }
              }
        }            
    });
}

module.exports.getCalCertAndDueDate = getCalCertAndDueDate;