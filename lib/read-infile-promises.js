
const fs = require('fs');

function readLines(filepath) {
    return new Promise(function (resolve, reject) {
        
        let fileStream = fs.createReadStream(filepath)
        let statement = []
        let data = ""
        
        fileStream
            .on('readable', () => {
                data += fileStream.read()
                while( data.indexOf('\n') >= 0) {
                    fileStream.emit('newLine', data.substring(0,data.indexOf('\n')))
                    data = data.substring(data.indexOf('\n')+1)                   
                }
            })

        fileStream
            .on('end', () => {
                fileStream.emit('newLine', data, true)
            })

        fileStream
            .on('newLine', (line_of_text, end_of_file) => {
                statement.push( line_of_text )
                if ( end_of_file ) {
                    resolve(statement.slice(0, statement.length-1))
                }
            })

        fileStream
            .on('error', (error) => {
                reject(error)
            })
    })
}

exports.readLines = readLines;