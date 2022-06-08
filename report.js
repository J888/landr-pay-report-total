const fs = require("fs");
const csv = require("csv-parser");
const chalk = require("chalk");

var fileName = process.argv.slice(2)[0];
var mySongObj = {},
  myStreamingStoreObj = {},
  myCountryObj = {},
  myStreamQuantObj = {};
var payTotal = 0.0;

const TRACK_NAME_IDENTIFIER = "Track";
const STORE_IDENTIFIER = "Store";
const STORE_SERVICE_IDENTIFIER = "Store service";
const COUNTRY_IDENTIFIER = "Country of sale or stream";
const EARNINGS_IDENTIFIER = "Net earnings (USD)";
const NUM_STREAMS_IDENTIFIER = "Quantity of sales or streams";
const printNewLine = _ => console.log("\n");
const printGreen = chalk.bold.greenBright;
const printCyan = chalk.cyan;
const printMagenta = chalk.magenta;
const printWhite = chalk.white;
const printBlue = chalk.blue;
const printYellow = chalk.yellow;

fs.createReadStream(fileName)
  .pipe(csv())
  .on("data", row => {
    let trackName = row[TRACK_NAME_IDENTIFIER];
    // if Store and Store service are the same, just use Store instead of `Store-Store service`
    let moneySource =
      row[STORE_IDENTIFIER] === row[STORE_SERVICE_IDENTIFIER]
        ? row[STORE_IDENTIFIER]
        : row[STORE_IDENTIFIER] + "-" + row[STORE_SERVICE_IDENTIFIER];
    let country = row[COUNTRY_IDENTIFIER];
    let quantityOfStreams = parseInt(row[NUM_STREAMS_IDENTIFIER]);
    let songEarning = parseFloat(row[EARNINGS_IDENTIFIER]);

    // initialize if not set yet
    if (!mySongObj[trackName]) {
      mySongObj[trackName] = 0;
      myStreamQuantObj[trackName] = 0;
    }

    mySongObj[trackName] += songEarning;
    myStreamQuantObj[trackName] += quantityOfStreams;

    // initialize if not set yet
    if (!myStreamingStoreObj[moneySource]) {
      myStreamingStoreObj[moneySource] = {
        earnings: 0.0,
        streamCount: 0,
      }
    }

    myStreamingStoreObj[moneySource]['earnings'] += songEarning;
    myStreamingStoreObj[moneySource]['streamCount'] += quantityOfStreams;

    myCountryObj[country] = myCountryObj[country] + songEarning || songEarning;
  })
  .on("end", () => {
    console.log("Done processing. Results are: ");

    keysSorted(mySongObj).forEach(key => {
      let moneyEarned = mySongObj[key];
      let numStreams = myStreamQuantObj[key];
      console.log(
        printMagenta(key) +
          ": $" +
          printGreen(moneyEarned.toFixed(2)) +
          printMagenta(" - (" + numStreams + " sales/streams)")
      );
      payTotal += moneyEarned;
    });

    printNewLine();

    console.log(printYellow(`Streams by Service/Platform:`))

    /**
     * Print the list of all [Store]: $[earnings] (streamCount) streams
     */
    sortedBy(myStreamingStoreObj, 'earnings').forEach(storeName => {
      let { earnings, streamCount } = myStreamingStoreObj[storeName];
      console.log(printWhite(storeName) + ": $" + printGreen(earnings.toFixed(2)) + ' ' + printWhite(`(${streamCount}) streams`));
    });

    printNewLine();

    keysSorted(myCountryObj).forEach(key => {
      let value = myCountryObj[key];
      process.stdout.write(
        printBlue(key) + ": $" + printGreen(value.toFixed(2)) + ", "
      );
    });

    printNewLine();

    console.log(
      printYellow("\nTotal: ") +
        printCyan("$" + payTotal.toFixed(2)) +
        "\n"
    );
  });

function keysSorted(obj) {
  // Get an array of the keys:
  let keys = Object.keys(obj);

  // Then sort by using the keys to lookup the values in the original object:
  return keys.sort(function(a, b) {
    return obj[b] - obj[a];
  });
}

function sortedBy(obj, sortByKey) {
  // Get an array of the keys:
  let keys = Object.keys(obj);

  // Then sort by using the keys to lookup the values in the original object:
  return keys.sort(function(a, b) {
    return obj[b][sortByKey] - obj[a][sortByKey];
  });
}
