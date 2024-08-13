import { ApiGwHttpApiRequestV2 } from '../lib/ApiGwHttpApiRequest.js';
import { ApiGwHttpApiResponse } from '../lib/ApiGwHttpApiResponse.js';

async function handler( event: any ) {
    try {
      console.info( 'AWS event input: ' + JSON.stringify( event ) );
  
      const request = new ApiGwHttpApiRequestV2( event );
  
      // Note: For HTTP APIs, let it infer the status unless Things Go Wrong.
      //       If you need more than 200s, make sure that the pattern you return matches exactly the
      //       pattern expected by HTTP APIs otherwise you'll get a 500.
      // See https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
      const responseBody = { message: "hello world" };
      const response = ApiGwHttpApiResponse.ok( responseBody );
      const httpResponse = response.toHttpApiResponseV2();
      console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );
  
      return httpResponse;
    } catch ( error ) {
      console.error( error );
  
      const response = ApiGwHttpApiResponse.fromJsError( error );
      const httpResponse = response.toHttpApiResponseV2();
      console.info( 'HTTP response: ' + JSON.stringify( httpResponse ) );
  
      return httpResponse;
    }
  }
  
  export {
    handler,
  };