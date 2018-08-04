
const fs = require('fs');

exports.getInfileAsArray = function(filepath, callback) {
    var fileStream = fs.createReadStream('/Users/richardwheatley/Developer/cdr-util-clone/test/dmc');

    var data = "";

    fileStream.on('readable', function() {
    //this functions reads chunks of data and emits newLine event when \n is found
    data += fileStream.read();
    while( data.indexOf('\n') >= 0 ){
        fileStream.emit('newLine', data.substring(0,data.indexOf('\n')));
        data = data.substring(data.indexOf('\n')+1);
    }
    });

    fileStream.on('end', function() {
    //this functions sends to newLine event the last chunk of data and tells it
    //that the file has ended
    fileStream.emit('newLine', data , true);
    });

    var statement = [];

    fileStream.on('newLine',function(line_of_text, end_of_file){
        //this is the code where you handle each line
        // line_of_text = string which contains one line
        // end_of_file = true if the end of file has been reached
        statement.push( line_of_text );
        if(end_of_file){
                // console.dir(statement.slice(0, statement.length-1));
                //here you have your statement object ready
                callback(null, statement.slice(0, statement.length-1))               
        }
    });
};