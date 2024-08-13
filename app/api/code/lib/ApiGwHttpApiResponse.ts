/* CONSTANTS */
const CONTENT_TYPES = {
    APPLICATION_JSON: 'application/json',
  };
  
  const HTTP_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQUEST_TIMEOUT: 408,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
  };
  
  /**
   * An unopinionated, formatted response to an API GW HTTP API request.
   */
  class ApiGwHttpApiResponse {
    body: string | object;
    cookies: object;
    headers: object;
    isBase64Encoded: boolean;
    httpStatusCode: number;
  
    /**
       * Build an ApiGwHttpApiResponse
       * @param {number} httpStatusCode HTTP Status code (e.g. 200, 404, 500, etc)
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    constructor( httpStatusCode, body, headers, cookies, isBase64Encoded = false ) {
      if ( !httpStatusCode ) throw new Error( 'statusCode is required.' );
  
      if ( !headers ) headers = {};
      if ( !headers[ 'content-type' ] ) headers[ 'content-type' ] = CONTENT_TYPES.APPLICATION_JSON;
  
      if ( isBase64Encoded !== true && isBase64Encoded !== false ) throw new Error( 'isBase64Encoded must be a boolean value.' );
  
      this.body = body;
      this.cookies = cookies;
      this.headers = headers;
      this.isBase64Encoded = isBase64Encoded;
      this.httpStatusCode = httpStatusCode;
    }
  
    /**
       * Return a Bad Request response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static badRequest( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.NOT_FOUND, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a Forbidden response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static forbidden( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.FORBIDDEN, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a basic error response.
       * @param {Error} jsError Javascript Error.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static fromJsError( jsError, headers?, cookies?, isBase64Encoded? ) {
      const body = {
        errorType: jsError.name,
        errorMessage: jsError.message,
      };
      return ApiGwHttpApiResponse.internalServerError( body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return an Internal Server Error response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static internalServerError( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a Not Found response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static notFound( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.NOT_FOUND, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a Not Implemented response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static notImplemented( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.NOT_IMPLEMENTED, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return an OK response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static ok( body, headers?, cookies?, isBase64Encoded? ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.OK, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a Request Timeout response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static requestTimeout( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.REQUEST_TIMEOUT, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return a Service Unavailable response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static serviceUnavailable( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.SERVICE_UNAVAILABLE, body, headers, cookies, isBase64Encoded );
    }
  
    /**
        * Return a Too Many Requests response.
        * @param {string | object} body Response body. Does not need to be stringified JSON.
        * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
        * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
        * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
        */
    static tooManyRequests( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.TOO_MANY_REQUESTS, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Return an Unauthorized response.
       * @param {string | object} body Response body. Does not need to be stringified JSON.
       * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
       * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
       * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
       */
    static unauthorized( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.UNAUTHORIZED, body, headers, cookies, isBase64Encoded );
    }
  
    /**
        * Return a Unprocessable Entity response.
        * @param {string | object} body Response body. Does not need to be stringified JSON.
        * @param {object} [headers] A set of key-value pairs corresponding to the response headers.
        * @param {object} [cookies] A set of key-value pairs corresponding to the response cookies.
        * @param {boolean} [isBase64Encoded=false] Whether or not the response body is base 64 encoded.
        */
    static unprocessableEntity( body, headers, cookies, isBase64Encoded ) {
      return new ApiGwHttpApiResponse( HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, body, headers, cookies, isBase64Encoded );
    }
  
    /**
       * Converts this object into the expected response format for HTTP APIs format 2.0.
       */
    toHttpApiResponseV2() {
      return {
        body: typeof this.body === 'string' ? this.body : JSON.stringify( this.body ),
        cookies: this.cookies,
        headers: this.headers,
        isBase64Encoded: this.isBase64Encoded,
        statusCode: this.httpStatusCode,
      };
    }
  }
  
  export {
    ApiGwHttpApiResponse,
  };    