const mysqlLib = require('mysql2/promise');
const logger = require("lib-logger")
const config = require('./config');
const utils = require("./utils");
const pool = mysqlLib.createPool(config.db.jerry);


function query(sql, options, throwError=false) {
    let connection;
    return pool.getConnection().then(conn => {
        connection = conn;
        return connection.execute(sql, options);
      }).then(results => {
        connection.release();
        return results[0];
      }).catch(err => {
        logger.error('Error while running query',{ sql, error: err });
        connection && connection.release();
        if (throwError) {
          throw err;
        }
        throw utils.httpError(500)
      });
}

function close() {
  return pool.end().then(() => {
    logger.info(`Closed the pool succesfully`)
  }).catch(err => {
    logger.error(`Unable to close the pool due to ${err.message}`)
  })
}

module.exports = {
    query,
    close
}