import uuid from 'uuid/v4';

import records from './s3-records.json';

let lambdaHandler;

function callHandler() {
  const context = {
    awsRequestId: uuid(),
    getRemainingTimeInMillis: () => 1000,
  };

  /*
{
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "eu-west-2",
            "eventTime": "2018-10-31T11:04:47.989Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "AWS:AROAJPGZ7UO62QWF57H4M:ingest-01-prd-normalize"
            },
            "requestParameters": {
                "sourceIPAddress": "35.178.186.13"
            },
            "responseElements": {
                "x-amz-request-id": "AA49707BCCA4BCBC",
                "x-amz-id-2": "Xs41VAMlpoZtgA91Siv8M0WVq8h8YFHJmEZWOJU3VWcaAkxpp2ftxho+qDzQtH80JANu+oEh1po="
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "6d2d4e51-f2a3-4553-ad40-cb56d30f3902",
                "bucket": {
                    "name": "synaptiv-norm-db",
                    "ownerIdentity": {
                        "principalId": "AUZ5MK33KGI8P"
                    },
                    "arn": "arn:aws:s3:::synaptiv-norm-db"
                },
                "object": {
                    "key": "2018/10/31/odos_357247053541930_d9df110c-37c4-4c7c-8108-463a592d03ee_1540983887.8906083.geojson",
                    "size": 608558,
                    "eTag": "edeedd1e10cd5a6c88a54870c9576f96",
                    "sequencer": "005BD98C4FE46B5F1A"
                }
            }
        }
    ]
  */
  const s3Event = {
    Records: records,
  };
  lambdaHandler(s3Event, context);
}

export function start(handler) {
  lambdaHandler = handler;
  callHandler();
}

export function pause() {
  lambdaHandler = null;
}

export function stop() {
  lambdaHandler = null;
}
