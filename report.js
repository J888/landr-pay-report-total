const { combined } = require("./lib/combiner");
const { csvRowsPromise } = require("./lib/fileRead");
const { print } = require("./lib/printer");
const { totals } = require("./lib/totaler");

const filePaths = process.argv.slice(2).filter(path => path.endsWith(`.csv`));

(async () => {

  if (!filePaths || filePaths.length == 0) {
    console.log(`\nINVALID INPUT: No CSV paths were given. Exiting.\n`)
    return;
  }

  const fileNames = filePaths.map(path => {
    let splits = path.split(`/`);
    return splits[splits.length - 1];
  })
  console.log(`Reading\n${fileNames.join(',\n')}`);

  let dataSet = [];
  for (let path of filePaths) {
    let csvRows = await csvRowsPromise(path);
    dataSet.push(totals(csvRows));
  }

  console.log(`\nResults:\n`);

  let dataCombined = combined(dataSet);

  print(dataCombined);

})();
