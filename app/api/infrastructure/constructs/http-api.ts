import { aws_apigatewayv2 as apigatewayv2 } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AcceleratorEnvironmentProps } from '../const/environment';
import { aws_iam as iam } from 'aws-cdk-lib';
import { LambdaFunction } from './lambda-function';
import { createCdkId } from '../utils/resource-naming-service';

export class HttpApi extends apigatewayv2.CfnApi {
  /**
   * Creates a Http Api 
   *
   * @param {Construct} scope The CDK scope in which the HttpApi will be created.
   * @param {string} id The unique CDK identifier for this HttpApi.
   * @param {HttpApiProps} props A set of properties used by the HttpApi.
   */    
  constructor( scope: Construct, id: string, props: HttpApiProps ) {
    super( scope, id, {
      corsConfiguration: 
        {
          allowMethods: [ 'GET', 'PUT', 'DELETE', 'OPTIONS' ],
          allowOrigins: [ '*' ],
        },
      description: 'Colors HTTP API',
      name: props.httpApiName,
      protocolType: 'HTTP',
    } );

    /**
    * Constructs Stage
    */  
    new apigatewayv2.CfnStage(
      this, 
      createCdkId( props.environment.stageId, 'Stage' ), 
      {
        apiId: this.attrApiId,
        autoDeploy: true,
        description: props.environment.stageId + 'stage for API deployment',
        stageName: props.environment.stageId,
      } );
      
    this.addLambdaIntegrations( props.lambdaIntegrations );
  }

  /**
   * Defines one or more lambda integrations and routes for the API
   *
   * @param {LambdaIntegrationProps} lambdaIntegrations Set of properties defining the lambda integration
   */
  public addLambdaIntegrations( lambdaIntegrations:LambdaIntegrationProps[] ) {

    lambdaIntegrations.forEach( lambdaIntegration => {
      const apiIntegration = new apigatewayv2.CfnIntegration(
        this,
        lambdaIntegration.integrationId,
        {
          description: 'Establishes an integration between the API and a Lambda function',
          apiId: cdk.Fn.ref( this.logicalId ),
          connectionType: 'INTERNET',
          integrationType: 'AWS_PROXY',
          integrationUri: `arn:${cdk.Fn.ref( 'AWS::Partition' )}:apigateway:${cdk.Fn.ref( 'AWS::Region' )}:lambda:path/2015-03-31/functions/${lambdaIntegration.lambda.functionArn}/invocations`,
          payloadFormatVersion: '2.0',
        },
      );

      new apigatewayv2.CfnRoute(
        this,
        lambdaIntegration.routeId,
        {
          apiId: cdk.Fn.ref( this.logicalId ),
          routeKey: lambdaIntegration.route,
          authorizationType: 'NONE',
          target: `integrations/${cdk.Fn.ref( apiIntegration.logicalId )}`,
        },
      );

      // Grant API Gateway principal permission to invoke function
      lambdaIntegration.lambda.grantInvoke( new iam.ServicePrincipal( 'apigateway.amazonaws.com' ) );
    } );

  }  
}

/**
* Configurable properties for an HttpApi
*/
export interface HttpApiProps {
    /**
     * The props required to create an integration and route for each lambda function
     */
    lambdaIntegrations: LambdaIntegrationProps[];
    /**
     * The name of the httpApi 
     */
    httpApiName: string,
    /**
     * The platform environment
     */
    environment: AcceleratorEnvironmentProps,
  }

/**
  * Configurable properties for Lambda Integrations and Routes
  */
export interface LambdaIntegrationProps {
    /**
    * Generated ID for each lambda's integration
    */
    readonly integrationId: string,
    /**
    * Generated ID for each lambda's route
    */
    readonly routeId: string,
    /**
    * The lambda specific route
    */
    readonly route: string,
    /**
    * The lambda itself
    */
    readonly lambda: LambdaFunction,
  }