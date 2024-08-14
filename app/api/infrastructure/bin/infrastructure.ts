#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { HttpApiStack } from '../lib/http-api-stack';
import { CDK_ENV, UIResourcePrefix } from '../const/environment';
import { CDK_ENV_DEV } from '../const/environment';
import { createCdkStackName, identifyResource } from '../utils/resource-naming-service';
import { UIStack } from '../lib/ui-stack';
import { ACCOUNT_ID } from '../aws_config_secrets';

const app = new cdk.App();


CDK_ENV.name = 'HttpApi';

if ( app.node.tryGetContext( 'stageId' ) ) {
  CDK_ENV.stageId = app.node.tryGetContext( 'stageId' );
  CDK_ENV_DEV.stageId = app.node.tryGetContext( 'stageId' );
}

new InfrastructureStack(app, 'InfrastructureStack', {});
new HttpApiStack(
  app, 
  'HttpApiStack', 
  {
    stackName: createCdkStackName( CDK_ENV.stageId, CDK_ENV.name ),
    description: `Nomadhair CDK environment: ${CDK_ENV.name}`,
    environment: CDK_ENV,
  }
);

const UI_BUCKET_NAME_OUTPUT_ID = identifyResource(UIResourcePrefix, "ui-host-bucket");
const UI_DISTRIBUTION_ID_OUTPUT_ID = identifyResource(UIResourcePrefix, "distribution-id");
new UIStack(
  app,
  identifyResource(UIResourcePrefix, "UIStack"),
  {
    env: {
      account: ACCOUNT_ID,
      region: "us-east-1",
    },
    resourcePrefix: UIResourcePrefix,
    hostedZoneName: "nomadhair.org",
    domainName: "reserve.nomadhair.org",
    includeWWW: false,
    siteSourcePath: "../../ui/nomad_hair_nextjs/out",
    staticSiteBucketNameOutputId: UI_BUCKET_NAME_OUTPUT_ID,
    staticSiteDistributionIdOutputId: UI_DISTRIBUTION_ID_OUTPUT_ID,
  }
)