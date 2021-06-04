const http = require("http");

function headerParser(app) {
    app.use(function headerParserMiddleware(req, res, next) {
      req.device = req.headers['n-device'] || 'desktop';
      req.platform = req.headers['n-platform'] || 'web';
      req.build = req.headers['n-build'] || '';
      let parts = (req.query.locale || req.headers['n-locale'] || '').split(/[-_]/g);
  
      if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
        req.locale = res.locale = { lang: parts[0].toLowerCase(), country: parts[1].toLowerCase() };
      } else {
        req.locale = res.locale = { lang: 'en', country: 'ae' };
      }
  
      req.locale.string = `${req.locale.lang}_${req.locale.country.toUpperCase()}`;
  
      next();
    });
}

/**
 * Configures the app with an error handler.
 * A message field is added to the error's json body. 
 */
function errorHandler(app, logger) {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      err.message = err.message ? err.message : "Empty error message";
  
      if (logger && logger.error) {
        logger.error(err, {
          status: statusCode,
          method: req.method,
          route: req.path
        });
      } else {
        console.error(err);
      }
  
      if (app.get("env") === "dev" && !err.statusCode) {
        throw err;
      }
      
      res.status(statusCode).send({
        message: err.statusCode ?  err.message : "Internal Server Error"
      });
    });
}

/**
 * Convenient wrapper to throw an error that has
 * an HTTP status code. These errors are public-friendly,
 * meaning their message can be displayed on the API.
 */
function httpError(code = 500, message = http.STATUS_CODES[code]) {
    const err = new Error();
    err.statusCode = code;
    err.message = message;
  
    if (typeof message === "object") {
      err.message = JSON.stringify(message);
      err.data = message;
    }
  
    return err;
}


/**
 * Exposes a public endpoint for health checks.
 */
function hc(app) {
    app.get("/public/hc", (req, res) => {
      res.end("OK");
    });
}

module.exports = {
    headerParser,
    errorHandler,
    httpError,
    hc
}