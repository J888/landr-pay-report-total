const TRACK_NAME_IDENTIFIER = "Track";
const STORE_IDENTIFIER = "Store";
const STORE_SERVICE_IDENTIFIER = "Store service";
const COUNTRY_IDENTIFIER = "Country of sale or stream";
const EARNINGS_IDENTIFIER = "Net earnings (USD)";
const NUM_STREAMS_IDENTIFIER = "Quantity of sales or streams";

/**
 * Returns totals
 * 
 * @param {*} csvRows - rows of input csv file
 * @returns an object containing totals across the given rows
 */
const totals = (csvRows) => {
  let data = {
    byStore: {},
    byCountry: {},
    byTrackName: {},
    earningsTotal: 0.0,
  };

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

    if (!data.byTrackName[trackName]) {
      data.byTrackName[trackName] = { earnings: 0.0, streams: 0 };
    }
    if (!data.byStore[moneySource]) {
      data.byStore[moneySource] = { earnings: 0.0, streams: 0 };
    }
    if (!data.byCountry[country]) {
      data.byCountry[country] = { earnings: 0.0, streams: 0 };
    }

    data.byTrackName[trackName].earnings += songEarning;
    data.byTrackName[trackName].streams += quantityOfStreams;

    data.byStore[moneySource].earnings += songEarning;
    data.byStore[moneySource].streams += quantityOfStreams;

    data.byCountry[country].earnings += songEarning;
    data.byCountry[country].streams += quantityOfStreams;
  }

  return data;
};

module.exports = { totals };
