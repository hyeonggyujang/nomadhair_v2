import { CDK_ENV } from '../const/environment';

const CDK_STACK_NAME_PREFIX = 'cdk';

/**
 * Generates an internal identifer for a CDK resource (PascalCase).
 * 
 * Note that this is used as the basis for CloudFormation Logical Ids:
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
 * 
 * @param {string} stage - The deployment environment (PascalCase).
 * @param {string} suffix - The CDK resource name (PascalCase).
 * @param {boolean} isStackId - Whether the id is for a stack. If true, omits accelerator name.
 * @returns {string} Concatenated CDK internal identifier.
 */
export function createCdkId( stage: string, suffix: string, isStackId?: boolean ): string {
  const stagePascal = stage.charAt( 0 ).toUpperCase() + stage.slice( 1 );
  const suffixPascal = suffix.charAt( 0 ).toUpperCase() + suffix.slice( 1 );

  const cdkId = isStackId ? `${stagePascal}${suffixPascal}` : `${stagePascal}${CDK_ENV.name}${suffixPascal}`;

  return cdkId;
}

/**
 * Generates a name for a CDK stack (kebab-case).
 * 
 * @param {string} stage - The deployment environment (kebab-case).
 * @param {string} suffix - The stack name suffix (kebab-case OR PascalCase).
 * @returns {string} Concatenated CDK stack name.
 */
export function createCdkStackName( stage: string, suffix: string ): string {
  return `${stage.toLowerCase()}-${CDK_STACK_NAME_PREFIX}-${convertPascalToKebab( suffix )}`;
}

/**
 * Generates a name for an AWS resource (kebab-case).
 * 
 * @param {string} stage - The deployment environment (kebab-case).
 * @param {string} suffix - The AWS resource name (kebab-case).
 * @returns {string} Concatenated AWS resource name.
 */
export function createAwsResourceName( stage: string, suffix: string ): string {
  return `${stage.toLowerCase()}-${convertPascalToKebab( CDK_ENV.name )}-${suffix.toLowerCase()}`;
}

/**
 * Converts a given PascalCase input to kebab-case.
 * 
 * @param {string} input - The input string (PascalCase).
 * @returns {string} Converted string output (kebab-case).
 */
export function convertPascalToKebab( input: string ): string {
  return input.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

/**
 * Converts a given kebab-case input to PascalCase.
 * 
 * @param {string} input - The input string (kebab-case).
 * @returns {string} Converted string output (PascalCase).
 */
export function convertKebabToPascal( input: string ): string {
  return input.replace( /(^\w|-\w)/g, clearAndUpper );
}

/**
 * Removes hyphens and capitalizes letters during conversion to PascalCase.
 * 
 * @param {string} input - The regex matching character.
 * @returns {string} The output character.
 */
function clearAndUpper( input: string ): string {
  return input.replace( /-/, '' ).toUpperCase();
}