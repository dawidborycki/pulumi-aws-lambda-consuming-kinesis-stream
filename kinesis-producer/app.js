'use strict';

var AWS = require('aws-sdk');

const streamName = 'kinesis-stream-d6d9e98';
const region = 'us-west-1';

var kinesis = new AWS.Kinesis({region : region});

var record = JSON.stringify({
    time : new Date().toLocaleTimeString(),
    reading : Math.floor(Math.random() * 1e2)
});

var recordParams = {
    Data : record,
    PartitionKey : 'my-sensor',
    StreamName : streamName
};

kinesis.putRecord(recordParams, function(err, data) {
    console.log(recordParams.Data);

    if (err) {
        console.log(err);
    }
    else {
        console.log('Successfully sent data to Kinesis.');
    }
});

