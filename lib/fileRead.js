const fs = require('fs');
const csv = require("csv-parser");

/**
 * Reads a CSV file.
 * 
 * @param {} filePath - path to csv file
 * @returns a Promise that once resolved will have an array of rows from a CSV 
 */
const csvRowsPromise = (filePath) => new Promise((resolve, reject) => {
  let rows = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      return resolve(rows);
    });
});

module.exports = { csvRowsPromise }
