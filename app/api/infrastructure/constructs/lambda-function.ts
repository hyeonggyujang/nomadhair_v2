// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// Import Lambda L2 construct
// import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration, Stack } from 'aws-cdk-lib';
import { EnvironmentProps } from '../const/environment';

// export class LambdaFunction extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // Define the Lambda function resource
//     const helloWorldFunction = new lambda.Function(this, 'HelloWorldFunction', {
//       runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
//       code: lambda.Code.fromAsset('lambda'), // Points to the lambda directory
//       handler: '../../code/helloWorld.handler', // Points to the 'hello' file in the lambda directory
//     });
//   }
// }


export const LAMBDA_DEFAULTS = {
  ARCHITECTURE: Architecture.ARM_64,
  MEMORY_SIZE: 128,
  RUNTIME: Runtime.NODEJS_18_X,
  TIMEOUT: Duration.seconds( 12 ),
};

export class LambdaFunction extends NodejsFunction {
  /**
   * Creates a new Lambda Function using the CDK "NodejsFunction" as a basis.
   *
   * @param {Construct} scope The CDK scope in which the construct will be created.
   * @param {string} id The unique CDK identifier.
   * @param {LambdaFunctionProps} props A set of properties.
   */
  constructor( scope: Construct, id: string, props: LambdaFunctionProps ) {
    super( scope, id, {
      architecture: LAMBDA_DEFAULTS.ARCHITECTURE,
      description: props.lambdaDescription,
      entry: props.lambdaHandlerFilePath,
      functionName: props.lambdaFunctionName,
      handler: props.lambdaHandlerName ?? 'handler',
      memorySize: LAMBDA_DEFAULTS.MEMORY_SIZE,
      runtime: LAMBDA_DEFAULTS.RUNTIME,
      timeout: props.lambdaTimeout ?? LAMBDA_DEFAULTS.TIMEOUT,
      environment: {
        'STAGE': props.environment.stageId,
        'REGION': Stack.of( scope ).region,
        ...props.environmentVariables,
      },
    } );
  }
}

/**
 * Configurable properties for an LambdaFunction.
 */
export interface LambdaFunctionProps {
  /**
 * The description of the lambda function
 */
  lambdaDescription?: string,
  /**
   * The name of the lambda function
   */
  lambdaFunctionName: string,
  /**
   * The path to the build folder containing the lambda 'index.ts' file
   */
  lambdaHandlerFilePath: string
  /**
   * The name of the lambda handler function
   */
  lambdaHandlerName?: string,
   /**
   * Optional timeout prop that allows you to override the default timeout
   */
  lambdaTimeout?: Duration,
  /**
   * The environment variables to be made available to the lambda function
   */
  environmentVariables?: Record<string, string>,
  /**
   * The CDK environment
   */
  environment: EnvironmentProps,
}