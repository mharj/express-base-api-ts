# express base project

## note

Currently build targets to NodeJS version 12.9.x and later

### features
 - error middleware (always JSON error messages)
 - Support for ETag cache validation and collision check functionality (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
 - cors and token example middlewares
 - JOI validation examples for body data
 - logger (log4js)
 - custom "env" module to utilize settings.json/docker secrets and env variables.
 - example API data "builder" functions (against API interfaces)
 - VC devcontainer to easy development without external depndencies
