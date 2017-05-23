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
        let dataset = builder.create('dataset')
        let table = dataset.ele('table', { 'name': outFile});

        Object.keys(parsedFile[0]).forEach((element) => {
            table.ele('column', element)
        });

        parsedFile.forEach(element => {
            let row = table.ele('row');
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
