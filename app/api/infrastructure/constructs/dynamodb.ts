import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { EnvironmentProps } from '../const/environment';
import { Construct } from 'constructs';


export class DynamoDbTable extends dynamodb.Table {

  /**
   * Creates a Http Api 
   *
   * @param {Construct} scope The CDK scope in which the HttpApi will be created.
   * @param {string} id The unique CDK identifier for this HttpApi.
   * @param {DynamoDbProps} props A set of properties used by the HttpApi.
   */    
    constructor( scope: Construct, id: string, props: DynamoDbProps ) {
        super( scope, id, {
            tableName: props.tableName,
            partitionKey: props.partitionKey,
            sortKey: props.sortKey
        });
    }
}

/**
* Configurable properties for an HttpApi
*/
export interface DynamoDbProps {
    /**
     * The name of the dynamoDB Table 
     */
    tableName: string,
    /**
     * The partition key of the table 
     */
    partitionKey: dynamodb.Attribute,
    /**
    /**
     * The sort key of the table 
     */
    sortKey?: dynamodb.Attribute,
    /**
     * The platform environment
     */
    environment: EnvironmentProps,
  }
  