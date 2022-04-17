A command line tool to print a report on artist earnings.

Input: .csv file downloaded from https://app.landr.com/. Has the following columns:
- "Payment Date"
- "Start of reporting period"
- "End of reporting period"
- "Store"
- "Store service"
- "Country of sale or stream"
- "Album"
- "UPC"
- "Track"
- "ISRC"
- "Quantity of sales or streams"
- "Gross earnings (USD)"
- "Net earnings (USD)"

Output: 
- Earnings by track, service, and country.
- Total earnings.

## Usage
```shell
$ git clone https://github.com/J888/landr-pay-report-total/
$ cd landr-pay-report-total
$ npm install
$
$ # print out report
$ node report <INPUT_CSV_PATH>
```
