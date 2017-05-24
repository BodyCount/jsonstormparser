# jsonstormparser
This app converts database result imported in json format from PHPStorm into PHPUnit xml format.

## Usage:
```
mkdir infiles
// Import some files from PHPStorm into infiles
node app.js
```
## Options
By default, jsonstormparser adds table and column names into output file.  
Add next option to insert only table rows:

```
 -r || -rows
```
In case you need to rewrite column values, add next object as first element to imported array:
``` javascript
  {
    "columnsToRewrite": [
      ["column1", "value"],
      ["column2", "value"]
    ],
    "onlyNull": true // true = rewrite only null values, false = rewrite all values
  }
```
