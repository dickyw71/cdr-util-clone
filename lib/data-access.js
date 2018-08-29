var oracledb = require('oracledb');

let _connection = null;

  exports.openDbConnection = function (callback) {
    oracledb.getConnection(
        {
          user          : process.env.NODE_ORACLEDB_USER || 'MDS_DEV4',
          password      : process.env.NODE_ORACLEDB_PASSWORD || 'Pa55word',
          connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || '192.168.56.101/CALDB'
        },
        function(err, connection) {
          if (err) {
            console.error(err.message);
            callback(err)
          }
          else {
              console.log('connection opened')
              _connection = connection;
              callback(err)
          }
        }
    )
  }

  exports.getSensor = function (barcode, callback) {
    if(!_connection) {
      callback({ message: 'Invalid connection'})
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
                callback(err)
                return;
            }
            callback(err, result)
        });
    }
  }

  exports.closeDbConnection = function (callback) {
    if(_connection) {
      _connection.close(
        function(err) {
          if (err) {
            console.error(err.message);
          }
          callback(err);
        }); 
    }
  }