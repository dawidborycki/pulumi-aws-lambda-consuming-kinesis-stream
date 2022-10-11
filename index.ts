import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const kinesisStream = new aws.kinesis.Stream("kinesis-stream", {
    retentionPeriod: 24,    
    shardLevelMetrics: [
        "IncomingBytes",
        "OutgoingBytes",
    ],
    streamModeDetails: {
        streamMode: "ON_DEMAND",
    }
});

const iamRole = new aws.iam.Role("iam-role-lambda", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Sid: "",
            Principal: {
                Service: "lambda.amazonaws.com",
            },
        }],
    }),
    managedPolicyArns: [aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole],
    inlinePolicies: [{
        name: "kinesis-lambda-policy",
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Action: ["kinesis:GetRecords", 
                    "kinesis:GetShardIterator", 
                    "kinesis:DescribeStream", 
                    "kinesis:ListShards", 
                    "kinesis:ListStreams"
                ],
                Effect: "Allow",
                Resource: "*",
            }],
        }),
    }]
});

const lambda = new aws.lambda.Function("lambda-kinesis-consumer", {
    code: new pulumi.asset.FileArchive("lambda-code/function.zip"),
    role: iamRole.arn,    
    handler: "index.handler",
    runtime: "nodejs14.x"    
});

const kinesisTrigger = new aws.lambda.EventSourceMapping("kinesis-lambda-trigger", {
    eventSourceArn: kinesisStream.arn,
    functionName: lambda.arn,
    startingPosition: "LATEST"
});