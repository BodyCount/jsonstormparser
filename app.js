const fs = require('fs');
const builder = require('xmlbuilder');

let filesDir = __dirname + '/files/';
let outFilesDir = __dirname + '/outfiles/';

let files = fs.readdirSync(filesDir);

files.forEach(file => {
    if (file.split('.').pop() != 'json') return;
    let outFile = file.split('.').shift();
    fs.readFile(`${filesDir}/${file}`, 'utf8', function (err, data) {
        let parsedFile = JSON.parse(data);

        if (!Array.isArray(parsedFile))
            throw 'File contains invalid JSON, should be array of items';

        let dataset = builder.create('dataset')
        let table = dataset.ele('table', { 'name': outFile});

        if (parsedFile[0].hasOwnProperty('columnsToRewrite')){
            var {columnsToRewrite} = parsedFile.shift();
        }

        Object.keys(parsedFile[0]).forEach((element) => {
            table.ele('column', element)
        });

        parsedFile.forEach(element => {
            let row = table.ele('row');
            
            if (typeof columnsToRewrite != 'undefined'){
                columnsToRewrite.forEach(([column, value] = rewriteOption) => {
                    if (element.hasOwnProperty(column) && element[column] == null){
                        element[column] = value;
                    }
                });
            }

            Object.values(element).forEach((value) => {
                row.ele((value !== null) ? 'value' : 'null', (value !== null) ? value : '');
            })
        });
        dataset.end({pretty: true});
        fs.writeFile(`${outFilesDir}/${outFile}.xml`, dataset, (err) => {
            if (err) throw err;
            console.log(`${outFile}.xml has been saved!`);
        });
    });
});
