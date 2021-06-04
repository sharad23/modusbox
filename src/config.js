/* global process */
const { env } = process;
var fs = require('fs');

module.exports = {
    db: {
      jerry: {
        host: env.DB_JERRY_HOST || "localhost",
        user: env.DB_JERRY_USER || "root",
        password: env.DB_JERRY_PASSWORD_FILE ? fs.readFileSync(env.DB_JERRY_PASSWORD_FILE,'utf8') : "root",
        database: "jerry"
      }
    },
    marketPlace: {
      domain: "http://api.marketstack.com/v1/",
      key: "1145c3ca3686eb83660ecf935c5bd119"
    }
}
