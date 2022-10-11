exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        // Decode payload
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
    }
    return `Successfully processed ${event.Records.length} records.`;
};