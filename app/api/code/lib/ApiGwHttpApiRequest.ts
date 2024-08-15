/**
 * JSON parser which returns the existing value on failure.
 * @param {String} val Value to attempt to parse.
 * @returns {*} The JSON-parsed object OR existing value, if parsing fails.
 */
function _tryParse( val ) {
    try {
      return JSON.parse( val );
    } catch ( error ) {
      return val;
    }
  }
  
  /**
   * An unopinionated, formatted request from an API GW HTTP API lambda integration (event version 2.0).
   */
  class ApiGwHttpApiRequestV2 {
    rawEvent: {
      body: any,
      cookies: any,
      headers: any,
      pathParameters: any,
      queryStringParameters: any,
      requestContext: any,
      stageVariables: any,
    };
    _body: any;
    _cookies: any; 
    _headers: any;
    _pathParameters: any;
    _queryStringParameters: any;
    _requestContext: any;
    _stageVariables: any;
    

    /**
       * Build an ApiGwHttpApiRequest
       * @param {object} rawHttpApiEventV2 Event v2.0 passed to an AWS Labmda from an API GW HTTP API.
       * @param {object | string} body Request body as an object, if JSON. Otherwise left as a string.
       * @param {object} headers Request headers as a set of key-value pairs, with multi-value headers transformed into arrays.
       */
    constructor( rawHttpApiEventV2 ) {
      this.rawEvent = rawHttpApiEventV2;
    }
  
    /**
       * Request body
       * @type {object | string}
       */
    get body() {
      if ( this._body ) {
        return this._body;
      }
  
      // Parse the body from a raw JSON string if possible.
      this._body = _tryParse( this.rawEvent.body );
      return this._body;
    }
  
    /**
       * Request cookies
       * @type {Array<string>}
       */
    get cookies() {
      if ( this._cookies ) {
        return this._cookies;
      }
  
      this._cookies = this.rawEvent.cookies;
      return this._cookies;
    }
  
    /**
       * Request headers
       * @type {object}
       */
    get headers() {
      if ( this._headers ) {
        return this._headers;
      }
  
      // Convert any headers containing commas into arrays.
      let _headers = {};
      for ( const key in this.rawEvent.headers ) {
        if ( this.rawEvent.headers[ key ]?.includes( ',' ) ) {
          _headers[ key ] = this.rawEvent.headers[ key ].split( ',' );
        } else {
          _headers[ key ] = this.rawEvent.headers[ key ];
        }
      }
  
      this._headers = _headers;
      return this._headers;
    }
  
    /**
       * Request path parameters
       * @type {object}
       */
    get pathParameters() {
      if ( this._pathParameters ) {
        return this._pathParameters;
      }
  
      this._pathParameters = this.rawEvent.pathParameters;
      return this._pathParameters;
    }
  
    /**
       * Request query string parameters
       * @type {object}
       */
    get queryStringParameters() {
      if ( this._queryStringParameters ) {
        return this._queryStringParameters;
      }
  
      this._queryStringParameters = this.rawEvent.queryStringParameters;
      return this._queryStringParameters;
    }
  
    /**
       * Request context
       * @type {object}
       */
    get requestContext() {
      if ( this._requestContext ) {
        return this._requestContext;
      }
  
      this._requestContext = this.rawEvent.requestContext;
      return this._requestContext;
    }
  
    /**
       * Request stage variables
       * @type {object}
       */
    get stageVariables() {
      if ( this._stageVariables ) {
        return this._stageVariables;
      }
  
      this._stageVariables = this.rawEvent.stageVariables;
      return this._stageVariables;
    }
  }
  
  export {
    ApiGwHttpApiRequestV2,
  };