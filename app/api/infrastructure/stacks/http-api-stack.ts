import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AcceleratorEnvironmentProps } from '../const/environment';
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
      createCdkId( props.environment.stageId, id, true ),
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
      createCdkId( props.environment.stageId, 'ColorsLambda' ),
      {
        environment: props.environment,
        lambdaHandlerFilePath: '../code/handlers/colors.ts',
        lambdaFunctionName: createAwsResourceName( props.environment.stageId, 'list-colors' ),
      },
    );

    /**
     * The HttpApi construct
     */
    new HttpApi(
      this,
      createCdkId( props.environment.stageId, 'ColorsHttpApi' ),
      {
        environment: props.environment,
        httpApiName: createAwsResourceName( props.environment.stageId, 'colors' ),
        lambdaIntegrations: [
          {
            integrationId: createCdkId( props.environment.stageId, 'ColorsEndpointIntegration' ),
            routeId: createCdkId( props.environment.stageId, 'ColorsEndpointRoute' ),
            route: 'GET /colors',
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
   * The accelerator environment
   */
  environment: AcceleratorEnvironmentProps
}