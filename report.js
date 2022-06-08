const chalk = require("chalk");
const { csvRowsPromise } = require("./lib/fileRead");

var filePath = process.argv.slice(2)[0];

const TRACK_NAME_IDENTIFIER = "Track";
const STORE_IDENTIFIER = "Store";
const STORE_SERVICE_IDENTIFIER = "Store service";
const COUNTRY_IDENTIFIER = "Country of sale or stream";
const EARNINGS_IDENTIFIER = "Net earnings (USD)";
const NUM_STREAMS_IDENTIFIER = "Quantity of sales or streams";
const printGreen = chalk.bold.greenBright;
const printCyan = chalk.cyan;
const printMagenta = chalk.magenta;
const printWhite = chalk.white;
const printBlue = chalk.blue;
const printYellow = chalk.yellow;

(async () => {
  let data = {
    byStore: {},
    byCountry: {},
    byTrackName: {},
    earningsTotal: 0.0
  }

  console.log(`Reading [${filePath}]`)
  let csvRows = await csvRowsPromise(filePath);

  for (let row of csvRows) {
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
    if (!data.byTrackName[trackName]) {
      data.byTrackName[trackName] = { earnings: 0.0, streams: 0 };
    }
    if (!data.byStore[moneySource]) {
      data.byStore[moneySource] = { earnings: 0.0, streams: 0 }
    }
    if (!data.byCountry[country]) {
      data.byCountry[country] = { earnings: 0.0, streams: 0 }
    }

    data.byTrackName[trackName].earnings += songEarning;
    data.byTrackName[trackName].streams += quantityOfStreams;

    data.byStore[moneySource].earnings += songEarning;
    data.byStore[moneySource].streams += quantityOfStreams;

    data.byCountry[country].earnings += songEarning;
    data.byCountry[country].streams += quantityOfStreams;
  }

  console.log(`Done processing ${csvRows.length} rows. Results are: `);

  sortedBy(data.byTrackName, 'earnings').forEach(track => {
    let { earnings, streams } = data.byTrackName[track];
    console.log(`${printMagenta(track)}: $${printGreen(earnings.toFixed(2))} - ${printMagenta(" - (" + streams + " sales/streams)")}`);
    data.earningsTotal += earnings;
  });

  console.log(printYellow(`\n\nStreams by Service/Platform:`))

  /**
   * Print the list of all [Store]: $[earnings] (streamCount) streams
   */
  sortedBy(data.byStore, 'earnings').forEach(storeName => {
    let { earnings, streams } = data.byStore[storeName];
    console.log(printWhite(storeName) + ": $" + printGreen(earnings.toFixed(2)) + ' ' + printWhite(`(${streams}) streams`));
  });

  console.log("\n")

  sortedBy(data.byCountry, 'earnings').forEach(country => {
    let {earnings,streams} = data.byCountry[country];
    process.stdout.write(`${printBlue(country)}: $${printGreen(earnings.toFixed(2))} (${printWhite(streams)}) streams, `)
  });

  console.log(`\n\n${printYellow('\nTotal:')} ${printCyan("$" + data.earningsTotal.toFixed(2))}\n`);
})()

function sortedBy(obj, sortByKey) {
  // Get an array of the keys:
  let keys = Object.keys(obj);

  // Then sort by using the keys to lookup the values in the original object:
  return keys.sort(function(a, b) {
    return obj[b][sortByKey] - obj[a][sortByKey];
  });
}
