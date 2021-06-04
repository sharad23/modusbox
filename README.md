# Modusbox stock tickers

This app is used to store the company symbols and show thier tickers and price history accordingly. It is depented upon MYSQL 5.7 to store the company symbols and Market API (https://marketstack.com/) to fetch the tickers. 

### APP FEATURES
1. Company
    - Add companies (POST /companies) => When creating a company we check if its already inserted and we also check if the symbol is actual stock symbol
    - Delete Companies (DELETE /companies/{id}) 
    - GET Copamies (GET /companies) => All the stored companies are returned with their ids and symbols
    - GET Company Detail (GET /companies/{id}) => Gets the detailed information about that company from the market api
2. Ticker
    - Get the ticker of the added company (GET /stocks/ticker/{symbol}) => Get the latest price of that stock 
    - Get the history of the added company (GET /stocks/history/{symbol}?fromDate={}&toDate={})

### TECHNICAL FEATURES
- First checks all dependencies like mysql and market api are running, the server will run only after these dependencies are  running
- Used mysql pool connection because it enchances the performance, as time is not spend on creating connections
- Health check apis are added, we assume that this apis are being called for profiling
- Deafult headers are added
- Every failed request is responsed with status 400, 404 and 500 along with the structure `{message: "some reason"}`
- Validation are added on the POST request
- Prepared staements are being used in order to prevent from SQL injections
- Gracefull shutdown are being implemented
- Some Unit test are being implemented 
- Secrets are being passed for mysql password

### POSTMAN DOC
https://www.getpostman.com/collections/077775bd6901de9cf154

### Installation
- sudo docker-compose build
- sudo docker-compose -d up







