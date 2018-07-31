var oracledb = require('oracledb');

let _connection = null;

// Get a non-pooled connection
// oracledb.getConnection(
//     {
//       user          : 'MDS_DEV4',
//       password      : 'Pa55word',
//       connectString : '192.168.56.101/CALDB'
//     },
//     function(err, connection) {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       connection.execute(
//         // The statement to execute
//         `SELECT bar_code as barcode
//             , cert_no 
//             , cal_due_date
//         FROM sensor s 
//         JOIN sensor_calibration sc 
//             ON(s.sensor_id = sc.sensor_id)
//         WHERE bar_code = :barcode`,
  
//         // The "bind value" is null
//         ['TZ000014'],
  
//         // execute() options argument.  Since the query only returns one
//         // row, we can optimize memory usage by reducing the default
//         // maxRows value.  For the complete list of other options see
//         // the documentation.
//         { maxRows: 1
//           //, outFormat: oracledb.OBJECT  // query result format
//           //, extendedMetaData: true      // get extra metadata
//           //, fetchArraySize: 100         // internal buffer allocation size for tuning
//         },
  
//         // The callback function handles the SQL execution results
//         function(err, result) {
//           if (err) {
//             console.error(err.message);
//             doRelease(connection);
//             return;
//           }
//           console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
//           console.log(result.rows);     // [ [ 180, 'Construction' ] ]
//           doRelease(connection);
//         });
//     });
  
  // Note: connections should always be released when not needed
  function doRelease(connection) {
    connection.close(
      function(err) {
        if (err) {
          console.error(err.message);
        }
      });
  }

  exports.openDbConnection = function (callback) {
    let error = null;
    let conn = null;
    oracledb.getConnection(
        {
          user          : process.env.NODE_ORACLEDB_USER || 'MDS_DEV4',
          password      : process.env.NODE_ORACLEDB_PASSWORD || 'Pa55word',
          connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || '192.168.56.101/CALDB'
        },
        function(err, connection) {
          if (err) {
            console.error(err.message);
            error = err
            return;
          }
          else {
              console.log('connection opened')
              _connection = Object.assign(_connection, connection);
              conn = _connection
          }
        }
    )
    callback(error, conn);
  }

  exports.getSensor = function (barcode, callback) {
 
    let _err = null;
    let _result = null;

    if(!_connection) {
      _err = { message: 'Invalid connection'}
    } 
    else {
        _connection.execute(
            // The statement to execute
            `SELECT bar_code as barcode
                , cert_no 
                , cal_due_date
            FROM sensor s 
            JOIN sensor_calibration sc 
                ON(s.sensor_id = sc.sensor_id)
            WHERE bar_code = :barcode`,
            [barcode], // The "bind value" is the requested barcode
    
            // execute() options argument.  Since the query only returns one
            // row, we can optimize memory usage by reducing the default
            // maxRows value.  For the complete list of other options see
            // the documentation.
            { maxRows: 1
            //, outFormat: oracledb.OBJECT  // query result format
            //, extendedMetaData: true      // get extra metadata
            //, fetchArraySize: 100         // internal buffer allocation size for tuning
            },
    
            // The callback function handles the SQL execution results
            function(err, result) {
            if (err) {
                console.error(err.message);
                _err = err;
                return;
            }
            _result = result;
        });
    }
    callback(_err, _result)
  }

  exports.closeDbConnection = function (callback) {
    let _err = null;
    if(_connection) {
      _connection.close(
        function(err) {
          if (err) {
            console.error(err.message);
          }
        }); 
    }
    callback(_err);
  }