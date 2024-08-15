import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentProps } from '../const/environment';
import { createAwsResourceName, createCdkId } from '../utils/resource-naming-service';
import { LambdaFunction } from '../constructs/lambda-function';
import { HttpApi } from '../constructs/http-api';
import { DynamoDbTable } from '../constructs/dynamodb';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

export class HttpApiStack extends Stack {
  /**
   * Create a new CDK stack representing an HTTP API
   *
   * @param {Construct} scope The CDK scope in which the stack will be created.
   * @param {string} id The unique CDK identifier for this stack.
   * @param {HttpApiStackProps} props A set of properties used by the sample feature stack.
   */
  constructor( scope: Construct, id: string, props: HttpApiStackProps ) {
    super(
      scope,
      createCdkId( props.environment.stageId, id ),
      {
        stackName: props.stackName,
        description: props.description,
        env: props.environment.cdkEnvironment,
      },
    );

    /**
     * Create Lambda handler for reservation table.
     */
    const ReservationHandlerLambdaFunction =  new LambdaFunction(
      this,
      createCdkId( props.environment.stageId, 'ReservationHandlerLambda' ),
      {
        environment: props.environment,
        lambdaHandlerFilePath: '../code/handlers/reservations.ts',
        lambdaFunctionName: createAwsResourceName( props.environment.stageId, 'handle-reservations' ),
      },
    );

    /**
     * Create DynamoDB Table
     */
    new DynamoDbTable(
      this,
      createCdkId( props.environment.stageId, 'reservationTable' ),
      {
        environment: props.environment,
        partitionKey: {
          name: "time",
          type: AttributeType.NUMBER,
        },
        tableName: "Reservation"
      },
    );

    /**
     * The HttpApi construct
     */
    new HttpApi(
      this,
      createCdkId( props.environment.stageId, 'NomadHairApi' ),
      {
        environment: props.environment,
        httpApiName: createAwsResourceName( props.environment.stageId, 'nomadHair' ),
        lambdaIntegrations: [
          {
            integrationId: createCdkId( props.environment.stageId, 'GetReservationEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'GetReservationEndpointRoute' ),
            route: 'GET /reservation',
            lambda: ReservationHandlerLambdaFunction,
          },
          {
            integrationId: createCdkId( props.environment.stageId, 'GetPaginatedReservationsEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'GetPaginatedReservationsEndpointRoute' ),
            route: 'GET /reservations',
            lambda: ReservationHandlerLambdaFunction,
            requestParameters: {
              'method.request.querystring.lastItem': true,
            }
          },
          {
            integrationId: createCdkId( props.environment.stageId, 'CreateTimeSlotEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'CreateTimeSlotEndpointRoute' ),
            route: 'PUT /reservation',
            lambda: ReservationHandlerLambdaFunction,
          },
          {
            integrationId: createCdkId( props.environment.stageId, 'CreateReservationEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'CreateReservationEndpointRoute' ),
            route: 'PATCH /reservation',
            lambda: ReservationHandlerLambdaFunction,
          },
          {
            integrationId: createCdkId( props.environment.stageId, 'DeleteTimeSlotEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'DeleteTimeSlotEndpointRoute' ),
            route: 'DELETE /reservation',
            lambda: ReservationHandlerLambdaFunction,
          },
          {
            integrationId: createCdkId( props.environment.stageId, 'CancelReservationEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'CancelReservationEndpointRoute' ),
            route: 'PATCH /reservationcancel',
            lambda: ReservationHandlerLambdaFunction,
          },
        ],
      },
    );

  }
}

/**
 * Configurable properties for a HttpApiStack
 */
export interface HttpApiStackProps {
  /**
   * The name of the stack
   */
  stackName: string,
  /**
   * A description of the stack
   */
  description: string,
  /**
   * The CDK environment
   */
  environment: EnvironmentProps
}