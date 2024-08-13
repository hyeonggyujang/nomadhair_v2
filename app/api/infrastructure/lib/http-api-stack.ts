import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentProps } from '../const/environment';
import { createAwsResourceName, createCdkId } from '../utils/resource-naming-service';
import { LambdaFunction } from '../constructs/lambda-function';
import { HttpApi } from '../constructs/http-api';

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
     * Create AWS resources via constructs.
     */
    const listColorsLambdaFunction =  new LambdaFunction(
      this,
      createCdkId( props.environment.stageId, 'HelloWorldLambda' ),
      {
        environment: props.environment,
        lambdaHandlerFilePath: '../code/handlers/helloWorld.ts',
        lambdaFunctionName: createAwsResourceName( props.environment.stageId, 'get-hello-world' ),
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
            integrationId: createCdkId( props.environment.stageId, 'NomadHairEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'CNomadHairEndpointRoute' ),
            route: 'GET /helloWorld',
            lambda: listColorsLambdaFunction,
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