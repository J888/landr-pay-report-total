const fs = require("fs");
const csv = require("csv-parser");
const chalk = require("chalk");

var fileName = process.argv.slice(2)[0];
var mySongObj = {},
  myStreamingStoreObj = {},
  myCountryObj = {},
  myStreamQuantObj = {};
var myTotalMoneyCount = 0.0;

const TRACK_NAME_IDENTIFER = "Track";
const STORE_IDENTIFIER = "Store";
const STORE_SERVICE_IDENTIFIER = "Store service";
const COUNTRY_IDENTIFIER = "Country of sale or stream";
const EARNINGS_IDENTIFIER = "Earnings generated (USD)";
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
    let trackName = row[TRACK_NAME_IDENTIFER];
    // if Store and Store service are the same, just use Store instead of `Store-Store service`
    let moneySource =
      row[STORE_IDENTIFIER] === row[STORE_SERVICE_IDENTIFIER]
        ? row[STORE_IDENTIFIER]
        : row[STORE_IDENTIFIER] + "-" + row[STORE_SERVICE_IDENTIFIER];
    let country = row[COUNTRY_IDENTIFIER];
    let quantityOfStreams = parseInt(row[NUM_STREAMS_IDENTIFIER]);
    let songEarning = parseFloat(row[EARNINGS_IDENTIFIER]);

    if (!mySongObj[trackName]) {
      mySongObj[trackName] = songEarning;
      myStreamQuantObj[trackName] = quantityOfStreams;
    } else {
      mySongObj[trackName] += songEarning;
      myStreamQuantObj[trackName] += quantityOfStreams;
    }

    myStreamingStoreObj[moneySource] =
      myStreamingStoreObj[moneySource] + songEarning || songEarning;

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
      myTotalMoneyCount += moneyEarned;
    });

    printNewLine();

    keysSorted(myStreamingStoreObj).forEach(key => {
      let value = myStreamingStoreObj[key];
      console.log(printWhite(key) + ": $" + printGreen(value.toFixed(2)));
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
      printYellow("\nTotal money count: ") +
        printCyan("$" + myTotalMoneyCount.toFixed(2)) +
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
