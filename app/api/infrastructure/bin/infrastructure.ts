#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { HttpApiStack } from '../lib/http-api-stack';
import { CDK_ENV } from '../const/environment';
import { CDK_ENV_DEV } from '../const/environment';
import { createCdkStackName } from '../utils/resource-naming-service';

const app = new cdk.App();


CDK_ENV.name = 'HttpApi';

if ( app.node.tryGetContext( 'stageId' ) ) {
  CDK_ENV.stageId = app.node.tryGetContext( 'stageId' );
  CDK_ENV_DEV.stageId = app.node.tryGetContext( 'stageId' );
}

new InfrastructureStack(app, 'InfrastructureStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
new HttpApiStack(
  app, 
  'HttpApiStack', 
  {
    stackName: createCdkStackName( CDK_ENV.stageId, CDK_ENV.name ),
    description: `Nomadhair CDK environment: ${CDK_ENV.name}`,
    environment: CDK_ENV,
  }
);