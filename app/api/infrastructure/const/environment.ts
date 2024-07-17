import { Environment } from 'aws-cdk-lib';

/**
 * A basic environment which denotes the target AWS account for deploying accelerator resources via CDK.
 */
export const ACCELERATOR_ENV: AcceleratorEnvironmentProps = {
  stageId: 'dev',
  name: 'nomad_hair_v2',
  cdkEnvironment: {
    account: '649588711656',
    region: 'us-east-1',
  },
};

/**
 * A development environment which denotes the target AWS account for deploying accelerator resources via CDK.
 */
// export const ACCELERATOR_ENV_DEV: AcceleratorEnvironmentProps = {
//   stageId: 'dev',
//   name: 'nomad_hair_v2',
//   cdkEnvironment: {
//     account: '649588711656',
//     region: 'us-east-1',
//   },
// };

/**
 * Configurable properties for CDK accelerator environments.
 */
export interface AcceleratorEnvironmentProps {
  /**
   * The name of the accelerator to be deployed
   */
  name: string,
  /**
   * The stage Id for the environment (i.e. dev, stg, prod)
   */
  stageId: string,
  /**
   * The deployment environment for a CDK stack.
   */
  cdkEnvironment: Environment,
}