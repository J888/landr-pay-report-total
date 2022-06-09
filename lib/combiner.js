/**
 * Combines multiple data lists
 *          so that the program can take in multiple CSVs.
 * 
 * DataList looks like
 * 
 * [
 *  {
      byStore: { 'spotify': { earnings: 12.34, streams: 1234 } },
      byCountry: { 'us': { earnings: 12.34, streams: 1234 } },
      byTrackName: { 'some track name': { earnings: 12.34, streams: 1234 } },
      earningsTotal: 0.0, 
    },
    ...
 * ]
 * 
 * 
 * @param {*} dataList 
 */
const combined = (dataList) => {
  return dataList.reduce((returnValOfPrevious, curr) => {

    let sum = {
      byStore: {},
      byCountry: {},
      byTrackName: {},
      earningsTotal: returnValOfPrevious.earningsTotal + curr.earningsTotal 
    };

    combineEarningsAndStreams(`byStore`, curr, returnValOfPrevious, sum);
    combineEarningsAndStreams(`byCountry`, curr, returnValOfPrevious, sum);
    combineEarningsAndStreams(`byTrackName`, curr, returnValOfPrevious, sum);

    return sum;
  })
}


/**
 * @param {*} theByKey - examples are `byStore`, `byCountry`
 */
const combineEarningsAndStreams = (theByKey, curr, prev, newData) => {
  for (let k in curr[theByKey]) {
    // if it's a new store that wasn't in the last calculation..
    if (!prev[theByKey][k]) {
      newData[theByKey][k] = { 
        earnings: curr[theByKey][k].earnings,
        streams: curr[theByKey][k].streams,
      }
    } else { // if it's a store present in the previous calculation object..
      newData[theByKey][k] = { 
        earnings: curr[theByKey][k].earnings + prev[theByKey][k].earnings,
        streams: curr[theByKey][k].streams + prev[theByKey][k].streams
      }
    }
  }
}

module.exports = { combined }
