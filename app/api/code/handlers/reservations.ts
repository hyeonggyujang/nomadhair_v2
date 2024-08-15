import { HttpResponse } from '@smithy/protocol-http';
import { ApiGwHttpApiRequestV2 } from '../lib/ApiGwHttpApiRequest.js';
import { ApiGwHttpApiResponse } from '../lib/ApiGwHttpApiResponse.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ReservationDataType } from '../models/reservationModel.js';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Reservations";
const pageSize = 60;

async function handler( event:any ) {
    console.info( 'Reservation handler is called with the event: ' + JSON.stringify( event ) );
    let response;
    try {
        switch (event.routeKey) {
            case "PUT /reservation":
                response = await createSlot( event );
            case "DELETE /reservation":
                response = await deleteSlot( event );
            case "GET /reservation":
                response = await getReservation( event );
            case "GET /reservations?lastItem={lastItem}":
                response = await getReservationsPaginated( event );
            case "PATCH /reservation":
                response = await createReservation( event );
            case "PATCH /reservationcancel":
                response = await cancelReservation( event );
        return response;
        }
    } catch (error) {
        console.error( error );
    
        const response = ApiGwHttpApiResponse.fromJsError( error );
        const httpResponse = response.toHttpApiResponseV2();
        console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );
    
        return httpResponse;
    }
}

async function createSlot( event:any ) {
    console.info( 'createSlot is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const reservationObj = new ReservationDataType( request.body );
    const dynamoDbResponse = await dynamo.send(
        new UpdateCommand({
          TableName: tableName,
          Key: {
            time: reservationObj.time
          },
          UpdateExpression: "set customerName = :customerName, address1 = :address1, address2 = :address2, city = :city, state = :state, zip = :zip",
          ExpressionAttributeValues: {
            ":customerName": reservationObj.customerName,
            ":address1": reservationObj.address1,
            ":address2": reservationObj.address2,
            ":city": reservationObj.city,
            ":state": reservationObj.state,
            ":zip": reservationObj.zip
          },
          ReturnValues: "ALL_NEW",
        })
      );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = { message: "Reservation successfully created" };
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}

async function deleteSlot( event:any ) {
    console.info( 'deleteSlot is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const reservationObj = new ReservationDataType( request.body );
    const dynamoDbResponse = await dynamo.send(
        new DeleteCommand({
            TableName: tableName,
            Key: {
              time: reservationObj.time,
            },
          })
      );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = { message: "Reservation slot successfully deleted" };
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}

async function getReservation( event:any ) {
    console.info( 'getReservation is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const reservationObj = new ReservationDataType( request.body );
    const dynamoDbResponse = await dynamo.send(
            new GetCommand({
              TableName: tableName,
              Key: {
                time: reservationObj.time,
              },
            })
          );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = dynamoDbResponse.Item;
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}


async function getReservationsPaginated( event:any ) {
    console.info( 'createReservation is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const startKey = request.queryStringParameters.lastItem;
    const dynamoDbResponse = await dynamo.send(
        new ScanCommand({
          TableName: tableName,
          Limit: pageSize,
          ExclusiveStartKey: {
            time: startKey
          }
        })
      );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = dynamoDbResponse;
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}

async function createReservation( event:any ) {
    console.info( 'createReservation is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const reservationObj = new ReservationDataType( request.body );
    const dynamoDbResponse = await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            time: reservationObj.time,
            endTime: reservationObj.endTime,
            customerName: reservationObj.customerName,
            address1: reservationObj.address1,
            address2: reservationObj.address2,
            city: reservationObj.city,
            state: reservationObj.state,
            zip: reservationObj.zip
          },
        })
      );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = { message: "Slot successfully created" };
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}

async function cancelReservation( event:any ) {
    console.info( 'cancelReservation is called' );

    const request = new ApiGwHttpApiRequestV2( event );
    const reservationObj = new ReservationDataType( request.body );
    const dynamoDbResponse = await dynamo.send(
        new UpdateCommand({
          TableName: tableName,
          Key: {
            time: reservationObj.time
          },
          UpdateExpression: "set customerName = :customerName, address1 = :address1, address2 = :address2, city = :city, state = :state, zip = :zip",
          ExpressionAttributeValues: {
            ":customerName": null,
            ":address1": null,
            ":address2": null,
            ":city": null,
            ":state": null,
            ":zip": null
          },
          ReturnValues: "ALL_NEW",
        })
      );
    console.info( "DynamoDB Response: " + JSON.stringify( dynamoDbResponse ) );

    const responseBody = { message: "Reservation successfully cancelled" };
    const response = ApiGwHttpApiResponse.ok( responseBody );
    const httpResponse = response.toHttpApiResponseV2();
    console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );

    return httpResponse;
}

export {
    handler,
  };