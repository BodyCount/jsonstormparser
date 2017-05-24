const fs = require('fs');
const builder = require('xmlbuilder');

var onlyRows = false;
process.argv.forEach((value) => {
  if (value == '-r' || value == '-rows'){
    onlyRows = true;
  }
});

let filesDir = __dirname + '/infiles/';
let outFilesDir = __dirname + '/outfiles/';

if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}
if (!fs.existsSync(outFilesDir)){
    fs.mkdirSync(outFilesDir);
}

fs.readdirSync(filesDir).forEach(file => {
    if (file.split('.').pop() != 'json') 
        throw 'File extension must be .json';

    let outFile = file.split('.').shift();
    fs.readFile(`${filesDir}/${file}`, 'utf8', (err, data) => {
        let parsedFile = JSON.parse(data);

        if (!Array.isArray(parsedFile))
            throw 'File contains invalid JSON, should be array of items';

        if (parsedFile[0].hasOwnProperty('columnsToRewrite')){
            var {columnsToRewrite, onlyNull} = parsedFile.shift();
        }

        let dataset = builder.create('dataset');
        if (!onlyRows) {
            var table = dataset.ele('table', { 'name': outFile});
            Object.keys(parsedFile[0]).forEach((element) => {
                table.ele('column', element)
            });
        }
        
        parsedFile.forEach(element => {
            let row = (typeof table !== 'undefined') 
                        ? table.ele('row') : dataset.ele('row');
            if (typeof columnsToRewrite !== 'undefined'){
                columnsToRewrite.forEach(([column, value] = rewriteOption) => {
                    if (element.hasOwnProperty(column) && element[column] == ((onlyNull)? null: element[column])){
                        element[column] = value;
                    }
                });
            }

            Object.values(element).forEach((value) => {
                row.ele((value !== null) ? 'value' : 'null', (value !== null) ? value : '');
            });
        });

        dataset.end({pretty: true});
        fs.writeFile(`${outFilesDir}/${outFile}.xml`, dataset, (err) => {
            if (err) throw err;
            console.log(`${outFile}.xml has been saved!`);
        });
    });
});
