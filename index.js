require('express-async-errors');
const express = require('express');
const logger = require("lib-logger");
const bodyParser = require('body-parser');
const utils = require('./src/utils');
const mysql = require('./src/mysql');
const company =  require('./src/company');
const stock = require('./src/stock');
const market = require('./src/market');
const READINESS_PROBE_DELAY = 1000

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({strict: false}));

utils.headerParser(app)
utils.hc(app)

app.post("/companies", async (req, res) => {
  return res.json(await company.create(req.body))
});

app.get("/companies", async (req, res) => {
  return res.json(await company.get())
});

app.delete("/companies/:id", async (req, res) => {
  return res.json(await company.remove(req.params.id));
});

app.get("/companies/:id", async (req, res) => {
  return res.json(await company.details(req.params.id));
});

app.get("/stocks/tickers/:symbol", async (req, res) => {
  return res.json(await stock.tickers(req.params.symbol));
});

app.get("/stocks/history/:symbol", async (req, res) => {
  return res.json(await stock.history(req.params.symbol, req.query.fromDate, req.query.toDate ))
});

utils.errorHandler(app)

let tries = 0;
let interval = setInterval(listen, 10000);
let server;

async function listen() {
  tries++;
  logger.info(`Running startup checks! #${tries}`);
  try {
    // check mysql is working
    await mysql.query("SELECT 1 as OK", null, true);
    // check market api is working
    await market.pingApi()
  } catch(err) {
    logger.error('Failed to run startup checks',{ error: err.message });
    if (tries > 5) {
      process.exit(1);
    }
    return;
  }

  clearInterval(interval);
  server = app.listen(8090, () => {
    logger.info('Serving the catalog on port 8090');
  })
}

process.on('SIGINT', () => {
    logger.info('Graceful shutdown start', new Date().toISOString())
    // Wait a little bit to give enough time for Kubernetes readiness probe to fail (we don't want more traffic)
    setInterval(() => {
        server.close(async (err) => {
            if (err) {
              process.exit(1)
            }
            await mysql.close()
            logger.info(`Server gracefully exited`);
            process.exit(0)
        })
    }, READINESS_PROBE_DELAY);
});
