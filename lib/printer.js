const chalk = require("chalk");
const printGreen = chalk.bold.greenBright;
const printCyan = chalk.cyan;
const printMagenta = chalk.magenta;
const printWhite = chalk.white;
const printBlue = chalk.blue;
const printYellow = chalk.yellow;

function sortedBy(obj, sortByKey) {
  // Get an array of the keys:
  let keys = Object.keys(obj);

  // Then sort by using the keys to lookup the values in the original object:
  return keys.sort(function(a, b) {
    return obj[b][sortByKey] - obj[a][sortByKey];
  });
}

const print = (data) => {
  sortedBy(data.byTrackName, 'earnings').forEach(track => {
    let { earnings, streams } = data.byTrackName[track];
    console.log(`${printMagenta(track)}: $${printGreen(earnings.toFixed(2))} (${printMagenta(`${streams} sales or streams`)})`);
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
}

module.exports = { print }
